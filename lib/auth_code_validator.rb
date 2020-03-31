class AuthCodeValidator
  attr_accessor :c, :p, :n

  A = "A".ord

  def initialize(c, p)
    @c = c
    @p = p
    @n = p + 1
    raise ArgumentError, "Params are not coprime" if c.gcd(n * n * n) != 1
  end

  def valid?(auth_code)
    codes = auth_code.upcase.codepoints.map { |cp| cp - A }
    check = codes.pop
    sum = codes.each_with_index.reduce(0) do |acc, (cp, i)|
      factor = 2 - (i % 2)
      addend = factor * cp
      acc + (addend / n).floor + addend % n
    end
    return false if check != n - 1 - (sum % n)

    true
  end

  def compute_rid(auth_code)
    codes = auth_code.upcase.codepoints.map { |cp| cp - A }
    codes.pop
    hash = codes.reduce { |acc, cp| acc * n + cp }
    codes.reverse!
    mdiv(hash - p, c, n * n * n)
  end

  private

  def minv(a, n)
    t = 0
    t_n = 1
    r = n
    r_n = a
    while r_n != 0
      q = r / r_n
      t, t_n = [t_n, t - q * t_n]
      r, r_n = [r_n, r - q * r_n]
    end
    return t + m if t < 0
    t
  end

  def mdiv(a, b, m)
    a %= m
    inv = minv(b, m)
    (((inv * a) % m) + m) % m
  end
end
