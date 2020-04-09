type OutputType = {
  desktopCode: string;
  desktopRid: string;
  mobileRid: string;
  mobileCode: string;
}

type Output = Partial<OutputType>;

const Output: Output = {};

const fillOutputFields = () => {
  Object.entries(Output).map(([key, value]) => {
    const strong = document.querySelector("#" + key) as HTMLInputElement
    strong.innerText = value
  })
}

const addToOutput = (code: HTMLInputElement, rid: HTMLInputElement) => {
  if (code.value) {
    Output.desktopRid = generateRid(code.value, 3557).toString()
    Output.mobileRid = generateRid(code.value, 3593).toString()
  }
  if (rid.value) {
    Output.desktopCode = generateCheckCode(parseInt(rid.value), 3557)
    Output.mobileCode = generateCheckCode(parseInt(rid.value), 3593)
  }
  fillOutputFields()
}

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("#check")
  if (!button) return;
  button.addEventListener("submit", (e) => {
    e.preventDefault()
    const code = document.querySelector("#code") as HTMLInputElement
    const rid = document.querySelector("#rid") as HTMLInputElement
    addToOutput(code, rid)
  })
})

function generateCheckCode(rid: number, seed: number) {
  function toChar(n: number) {
    return String.fromCharCode(n + A);
  }
  const N = 26;
  const A = "A".charCodeAt(0);
  let hash = (rid * seed + 25) % (N * N * N);
  const code = [];
  for (let i = 0; i < 3; i++) {
    code.push(hash % N);
    hash = Math.floor(hash / N);
  }
  const sum = code.reduce(function(acc, codePoint, index) {
    const factor = 2 - (index % 2);
    const addend = factor * codePoint;
    return acc + Math.floor(addend / N) + (addend % N);
  }, 0);
  return (
    code
      .reverse()
      .map(toChar)
      .join("") + toChar(N - 1 - (sum % N))
  );
}

function generateRid(checkCode: string, seed: number) {
  function toCharPoint(c: string) {
    return c.charCodeAt(0) - A;
  };

  function minv(a: number, n: number) {
    let t = 0;
    let t_n = 1;
    let r = n;
    let r_n = a;

    while (r_n != 0) {
      let q = Math.floor(r / r_n);
      let t_old = t;
      t = t_n;
      t_n = t_old - q * t_n;
      let r_old = r;
      r = r_n;
      r_n = r_old - q * r_n;
    };
    if (t < 0) return t + n;

    return t;
  };

  function mdiv(a: number, b: number, m: number) {
    a = a % m;
    const inv = minv(b, m);
    return (((inv * a) % m) + m) % m;
  };

  const N = 26;
  const A = "A".charCodeAt(0);

  const code = Array.from(checkCode.trim().toUpperCase()).map(toCharPoint);
  const check = code.pop();
  const hash = code.reduce(function(acc, val){
    return acc * N + val;
  });

  code.reverse();
  const sum = code.reduce(function(acc, codePoint, index) {
    const factor = 2 - (index % 2);
    const addend = factor * codePoint;
    return acc + Math.floor(addend / N) + (addend % N);
  }, 0);

  if (check !== N - 1 - (sum % N)) return NaN;

  return mdiv(hash - 25, seed, N * N * N);
};
