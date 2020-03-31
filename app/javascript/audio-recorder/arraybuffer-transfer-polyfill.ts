interface ArrayBufferConstructor {
  readonly prototype: ArrayBuffer;
  new (byteLength: number): ArrayBuffer;
  isView(arg: any): arg is ArrayBufferView;
  transfer(source: ArrayBuffer, length?: number): ArrayBuffer;
}
declare var ArrayBuffer: ArrayBufferConstructor;

if (!ArrayBuffer.transfer) {
  ArrayBuffer.transfer = function(source: ArrayBuffer, length?: number) {
    if (!(source instanceof ArrayBuffer))
      throw new TypeError("Source must be an instance of ArrayBuffer");
    if (length === undefined || length < source.byteLength)
      return source.slice(0, length);
    const sourceView = new Uint8Array(source);
    const destView = new Uint8Array(new ArrayBuffer(length));
    destView.set(sourceView);
    return destView.buffer;
  };
}
