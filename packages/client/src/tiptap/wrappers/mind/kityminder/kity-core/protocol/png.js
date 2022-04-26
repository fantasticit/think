define(function(require, exports, module) {
    var kity = require('../core/kity');
    var data = require('../core/data');
    var Promise = require('../core/promise');

    var DomURL = window.URL || window.webkitURL || window;

    function loadImage(info, callback) {
        return new Promise(function(resolve, reject) {
            var image = document.createElement("img");
            image.onload = function() {
                resolve({
                    element: this,
                    x: info.x,
                    y: info.y,
                    width: info.width,
                    height: info.height
                });
            };
            image.onerror = function(err) {
                reject(err);
            };

            image.crossOrigin = 'anonymous';
            image.src = info.url;
        });
    }

    /**
     * xhrLoadImage: 通过 xhr 加载保存在 BOS 上的图片
     * @note: BOS 上的 CORS 策略是取 headers 里面的 Origin 字段进行判断
     *        而通过 image 的 src 的方式是无法传递 origin 的，因此需要通过 xhr 进行
     */
    function xhrLoadImage(info, callback) {
        return Promise(function (resolve, reject) {
            var xmlHttp = new XMLHttpRequest();

            xmlHttp.open('GET', info.url + '?_=' + Date.now(), true);
            xmlHttp.responseType = 'blob';
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    var blob = xmlHttp.response;

                    var image = document.createElement('img');
                    
                    image.src = DomURL.createObjectURL(blob);                    
                    image.onload = function () {
                        DomURL.revokeObjectURL(image.src);
                        resolve({
                            element: image,
                            x: info.x,
                            y: info.y,
                            width: info.width,
                            height: info.height
                        });
                    };
                }
            };

            xmlHttp.send();
        });
    }

    function getSVGInfo(minder) {
        var paper = minder.getPaper(),
            paperTransform,
            domContainer = paper.container,
            svgXml,
            svgContainer,
            svgDom,

            renderContainer = minder.getRenderContainer(),
            renderBox = renderContainer.getRenderBox(),
            width = renderBox.width + 1,
            height = renderBox.height + 1,

            blob, svgUrl, img;

        // 保存原始变换，并且移动到合适的位置
        paperTransform = paper.shapeNode.getAttribute('transform');
        paper.shapeNode.setAttribute('transform', 'translate(0.5, 0.5)');
        renderContainer.translate(-renderBox.x, -renderBox.y);

        // 获取当前的 XML 代码
        svgXml = paper.container.innerHTML;

        // 回复原始变换及位置
        renderContainer.translate(renderBox.x, renderBox.y);
        paper.shapeNode.setAttribute('transform', paperTransform);

        // 过滤内容
        svgContainer = document.createElement('div');
        svgContainer.innerHTML = svgXml;
        svgDom = svgContainer.querySelector('svg');
        svgDom.setAttribute('width', renderBox.width + 1);
        svgDom.setAttribute('height', renderBox.height + 1);
        svgDom.setAttribute('style', 'font-family: Arial, "Microsoft Yahei","Heiti SC";');

        svgContainer = document.createElement('div');
        svgContainer.appendChild(svgDom);

        svgXml = svgContainer.innerHTML;

        // Dummy IE
        svgXml = svgXml.replace(' xmlns="http://www.w3.org/2000/svg" ' +
            'xmlns:NS1="" NS1:ns1:xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:NS2="" NS2:xmlns:ns1=""', '');

        // svg 含有 &nbsp; 符号导出报错 Entity 'nbsp' not defined ,含有控制字符触发Load Image 会触发报错
        svgXml = svgXml.replace(/&nbsp;|[\x00-\x1F\x7F-\x9F]/g, "");

        // fix title issue in safari
        // @ http://stackoverflow.com/questions/30273775/namespace-prefix-ns1-for-href-on-tagelement-is-not-defined-setattributens
        svgXml = svgXml.replace(/NS\d+:title/gi, 'xlink:title');

        blob = new Blob([svgXml], {
            type: 'image/svg+xml'
        });

        svgUrl = DomURL.createObjectURL(blob);

        //svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgXml);

        var imagesInfo = [];

        // 遍历取出图片信息
        traverse(minder.getRoot());

        function traverse(node) {
            var nodeData = node.data;
            
            if (nodeData.image) {
                minder.renderNode(node);
                var nodeData = node.data;
                var imageUrl = nodeData.image;
                var imageSize = nodeData.imageSize;
                var imageRenderBox = node.getRenderBox("ImageRenderer", minder.getRenderContainer());
                var imageInfo = {
                    url: imageUrl,
                    width: imageSize.width,
                    height: imageSize.height,
                    x: -renderContainer.getBoundaryBox().x + imageRenderBox.x,
                    y: -renderContainer.getBoundaryBox().y + imageRenderBox.y
                };

                imagesInfo.push(imageInfo);
            }

            // 若节点折叠，则直接返回
            if (nodeData.expandState === 'collapse') {
                return;
            }

            var children = node.getChildren();
            for (var i = 0; i < children.length; i++) {
                traverse(children[i]);
            }
        }

        return {
            width: width,
            height: height,
            dataUrl: svgUrl,
            xml: svgXml,
            imagesInfo: imagesInfo
        };
    }


    function encode(json, minder, option) {

        var resultCallback;

        /* 绘制 PNG 的画布及上下文 */
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        /* 尝试获取背景图片 URL 或背景颜色 */
        var bgDeclare = minder.getStyle('background').toString();
        var bgUrl = /url\(\"(.+)\"\)/.exec(bgDeclare);
        var bgColor = kity.Color.parse(bgDeclare);

        /* 获取 SVG 文件内容 */
        var svgInfo = getSVGInfo(minder);
        var width = option && option.width && option.width > svgInfo.width ? option.width : svgInfo.width;
        var height = option && option.height && option.height > svgInfo.height ? option.height : svgInfo.height;
        var offsetX = option && option.width && option.width > svgInfo.width ? (option.width - svgInfo.width)/2 : 0;
        var offsetY = option && option.height && option.height > svgInfo.height ? (option.height - svgInfo.height)/2 : 0;
        var svgDataUrl = svgInfo.dataUrl;
        var imagesInfo = svgInfo.imagesInfo;

        /* 画布的填充大小 */
        var padding = 20;

        canvas.width = width + padding * 2;
        canvas.height = height + padding * 2;

        function fillBackground(ctx, style) {
            ctx.save();
            ctx.fillStyle = style;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }

        function drawImage(ctx, image, x, y, width, height) {
            if (width && height) {
                ctx.drawImage(image, x + padding, y + padding, width, height);
            } else {
                ctx.drawImage(image, x + padding, y + padding);
            }
        }

        function generateDataUrl(canvas) {
            return canvas.toDataURL('image/png');
        }

        // 加载节点上的图片
        function loadImages(imagesInfo) {
            var imagePromises = imagesInfo.map(function(imageInfo) {
                return xhrLoadImage(imageInfo);
            });

            return Promise.all(imagePromises);
        }

        function drawSVG() {
            var svgData = {url: svgDataUrl};

            return loadImage(svgData).then(function($image) {
                drawImage(ctx, $image.element, offsetX, offsetY, $image.width, $image.height);
                return loadImages(imagesInfo);
            }).then(function($images) {
                for(var i = 0; i < $images.length; i++) {
                    drawImage(ctx, $images[i].element, $images[i].x + offsetX, $images[i].y + offsetY, $images[i].width, $images[i].height);
                }

                DomURL.revokeObjectURL(svgDataUrl);
                document.body.appendChild(canvas);
                var pngBase64 = generateDataUrl(canvas);
                
                document.body.removeChild(canvas);
                return pngBase64;
            }, function(err) {
                // 这里处理 reject，出错基本上是因为跨域，
                // 出错后依然导出，只不过没有图片。
                alert('脑图的节点中包含跨域图片，导出的 png 中节点图片不显示，你可以替换掉这些跨域的图片并重试。');
                DomURL.revokeObjectURL(svgDataUrl);
                document.body.appendChild(canvas);

                var pngBase64 = generateDataUrl(canvas);
                document.body.removeChild(canvas);
                return pngBase64;
            });
        }

        if (bgUrl) {
            var bgInfo = {url: bgUrl[1]};
            return loadImage(bgInfo).then(function($image) {
                fillBackground(ctx, ctx.createPattern($image.element, "repeat"));
                return drawSVG();
            });
        } else {
            fillBackground(ctx, bgColor.toString());
            return drawSVG();
        }
    }
    data.registerProtocol("png", module.exports = {
        fileDescription: "PNG 图片",
        fileExtension: ".png",
        mineType: "image/png",
        dataType: "base64",
        encode: encode
    });
});
