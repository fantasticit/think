import SparkMD5 from 'spark-md5';

addEventListener('message', (e) => {
  const chunks = e.data.chunks || [];

  if (!chunks.length) return;

  const spark = new SparkMD5.ArrayBuffer();
  const reader = new FileReader();
  let index = 0;

  const load = () => {
    const chunk = chunks[index];
    reader.readAsArrayBuffer(chunk);
  };

  reader.onload = (e) => {
    spark.append(e.target.result);

    if (index === chunks.length - 1) {
      const md5 = spark.end();
      postMessage({ md5 });
      self.close();
    } else {
      index++;
      load();
    }
  };

  load();
});
