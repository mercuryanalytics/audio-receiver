# frozen_string_literal: true

# rubocop:disable Naming/MethodParameterName
class AuthCodeValidator
  attr_accessor :c, :p

  A = 'A'.ord
  N = 26

  def initialize(c, p)
    @c = c
    @p = p
    raise ArgumentError, 'Params are not coprime' if c.gcd(N * N * N) != 1
  end

  def valid?(auth_code)
    codes = auth_code.upcase.codepoints.map { |cp| cp - A }
    check = codes.pop
    return false if check != N - 1 - (check_sum(codes) % N)

    true
  end

  def compute_rid(auth_code)
    codes = auth_code.upcase.codepoints.map { |cp| cp - A }
    codes.pop
    hash = codes.reduce { |acc, cp| acc * N + cp }
    codes.reverse!
    mdiv(hash - p, c, N * N * N)
  end

  def compute_auth_code(rid)
    hash = (rid * c + p) % (N * N * N)

    codes = []
    3.times do
      codes << hash % N
      hash /= N
    end
    sum = check_sum(codes)
    codes.reverse!
    codes << (N - 1 - (sum % N))
    codes.map { |cp| (cp + A).chr }.join('')
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
    return t + n if t.negative?

    t
  end

  def mdiv(a, b, m)
    a %= m
    inv = minv(b, m)
    (((inv * a) % m) + m) % m
  end

  def check_sum(codes)
    codes.each_with_index.reduce(0) do |acc, (cp, i)|
      factor = 2 - (i % 2)
      addend = factor * cp
      acc + (addend / N).floor + addend % N
    end
  end
end
# rubocop:enable Naming/MethodParameterName
