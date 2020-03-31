export default class StreamToServer implements UnderlyingSink {
  private url: string;
  private seq: number = 0;
  private chunks: Int8Array[] = [];
  private limit: number;
  private size: number = 0;

  constructor(url: string, limit: number) {
    this.url = url;
    this.limit = limit;
  }

  async write(chunk: Int8Array) {
    this.chunks.push(chunk);
    this.size += chunk.byteLength;
    if (this.size < this.limit) return;

    this.deliver();
  }

  private async deliver() {
    const body = new Blob(this.chunks.splice(0), { type: "audio/mpeg" });
    this.size = 0;

    const resp = await fetch(this.url, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "audio/mpeg",
        "X-Sequence-Number": (this.seq++).toString()
      },
      body
    });
    if (!resp.ok) throw Error(`${resp.status} ${resp.statusText}`);
  }

  close() {
    this.deliver();
  }
}
