const N = 26;
const A = "A".charCodeAt(0);

const gcd = (a: number, b: number): [number, number, number] => {
  if (a === 0) return [b, 0, 1];
  const [g, x, y] = gcd(b % a, a);
  return [g, y - Math.floor(b / a) * x, x];
};
const minv = (b: number, m: number) => {
  const [g, x] = gcd(b, m);
  if (g !== 1) return NaN;
  return ((x % m) + m) % m;
};
const mdiv = (a: number, b: number, m: number) => {
  a %= m;
  const inv = minv(b, m);
  return (((inv * a) % m) + m) % m;
};

export const validateAuthorizationCode = (s: string) => {
  const codes = Array.from(s.toUpperCase()).map(c => c.charCodeAt(0) - A);
  const check = codes.pop();
  const hash = codes.reduce((acc, val) => acc * N + val);

  codes.reverse();
  const sum = codes.reduce((acc, codePoint, index) => {
    const factor = 2 - (index % 2);
    const addend = factor * codePoint;
    return acc + Math.floor(addend / N) + (addend % N);
  }, 0);

  if (check === N - 1 - (sum % N)) return mdiv(hash - 25, 3557, N * N * N);
  return NaN;
};

export const ridFromAuthorizationCode = (s: string) => {
  const codes = Array.from(s.toUpperCase()).map(c => c.charCodeAt(0) - A);
  codes.pop();
  const hash = codes.reduce((acc, val) => acc * N + val);
  // hash == rid * 3557 + 25  (mod N * N * N)
  return mdiv(hash - 25, 3557, N * N * N);
};

export const autocorrelation = (data: Float32Array) => {
  const n = data.length - 1;
  const mean = data.reduce((mean, x, n) => mean + (x - mean) / (n + 1), 0);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += (data[i] - mean) * (data[i + 1] - mean);
  }
  return sum / n;
};

export const convertBuffer = (chunk: Float32Array) => {
  const len = chunk.length;
  const result = new Int16Array(len);
  for (let i = 0; i < len; i++) {
    result[i] = 0x8000 * chunk[i];
  }
  return result;
};

export class TransformFloatToIntegerStream extends TransformStream {
  constructor() {
    super({
      transform(chunk, controller) {
        controller.enqueue(convertBuffer(chunk));
      }
    });
  }
}
