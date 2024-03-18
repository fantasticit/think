const getProgressTitle = (index) => {
  switch (index) {
    case 0:
      return '移除进度';
    case 1:
      return '未开始';
    case 9:
      return '全部完成';
    default:
      return '完成' + (index - 1) + '/8';
  }
};

export const PROGRESSES = Array.from({ length: 10 }, (_, i) => {
  return {
    text: getProgressTitle(i),
    value: i,
  };
});

export const PRIORITIES = [
  {
    text: '移除优先级',
    value: 0,
  },
  ...Array.from({ length: 9 }, (_, i) => {
    return {
      text: `P${i + 1}`,
      value: i + 1,
    };
  }),
];

export const TEMPLATES = [
  {
    label: '经典',
    value: 'default',
  },
  {
    label: '文件夹',
    value: 'filetree',
  },
  {
    label: '鱼骨图',
    value: 'fish-bone',
  },
  {
    label: '靠右',
    value: 'right',
  },
  {
    label: '组织',
    value: 'structure',
  },
  {
    label: '天盘',
    value: 'tianpan',
  },
];

export const THEMES = [
  {
    label: '经典',
    value: 'classic',
    style: {
      color: 'rgb(68, 51, 0)',
      background: ' rgb(233, 223, 152)',
    },
  },
  {
    label: '紧凑',
    value: 'classic-compact',
    style: {
      color: 'rgb(68, 51, 0)',
      background: ' rgb(233, 223, 152)',
    },
  },
  {
    label: '清新红',
    value: 'fresh-red',
    style: {
      color: 'white',
      background: ' rgb(191, 115, 115)',
    },
  },
  {
    label: '泥土黄',
    value: 'fresh-soil',
    style: {
      color: 'white',
      background: 'rgb(191, 147, 115)',
    },
  },
  {
    label: '文艺绿',
    value: 'fresh-green',
    style: {
      color: 'white',
      background: 'rgb(115, 191, 118)',
    },
  },
  {
    label: '天空蓝',
    value: 'fresh-blue',
    style: {
      color: 'white',
      background: 'rgb(115, 161, 191)',
    },
  },
  {
    label: '浪漫紫',
    value: 'fresh-purple',
    style: {
      color: 'white',
      background: 'rgb(123, 115, 191)',
    },
  },
  {
    label: '胭脂粉',
    value: 'fresh-pink',
    style: {
      color: 'white',
      background: 'rgb(191, 115, 148)',
    },
  },
  {
    label: '冷光',
    value: 'snow',
    style: {
      color: '#fff',
      background: 'rgb(164, 197, 192)',
    },
  },
  {
    label: '鱼骨图',
    value: 'fish',
    style: {
      color: '#fff',
      background: 'rgb(58, 65, 68)',
    },
  },
];

export const MIN_ZOOM = 10;
export const MAX_ZOOM = 200;
export const ZOOM_STEP = 15;
