import math, random
from typing import Tuple, Union

class RSA:
    p: int
    q: int
    n: int
    e: int
    d: int
    phi: int

    def __init__(self, p: int = -1, q: int = -1):
        self.p = p
        self.q = q
        self.n = -1
        self.e = -1
        self.d = -1

    def __str__(self) -> str:
        return f"p = {self.p:,}, q = {self.q:,}, n = {self.n:,}, e = {self.e:,}, d = {self.d:,}"

    @staticmethod
    def string_to_number(s: str) -> int:
        """Convert a string to a number"""
        ret = 0
        for c in s:
            ret = (ret << 8) + ord(c)
        return ret
        
    @staticmethod
    def number_to_string(n: int) -> str:
        """Convert a number to a string"""
        ret = str("")
        while n:
            ret = ret + chr(n & 255)
            n >>= 8
        ret = ret[::-1]
        return ret

    @staticmethod
    def power(x: int, y: int, m: int) -> int:
        """Calculate x^y % m in O(log y) time complexity"""        
        ret = 1
        while y:
            if (y & 1): ret = ret * x % m
            x = x * x % m
            y >>= 1
        return ret
            
    def create(self) -> str:
        if self.p == -1 and self.q == -1:
            self.p, self.q = RSA.get_large_p_q(1 << 224)
        elif self.p == -1:
            self.p = RSA.generate_prime_number(1 << 224)
        elif self.q == -1:
            self.q = RSA.generate_prime_number(1 << 224)
            
        self.n = self.p * self.q
        
        self.phi = (self.p - 1) * (self.q - 1)
        
        while True:
            self.e = random.randint(1 << 50, 1 << 51)
            if math.gcd(self.e, self.phi) == 1:
                break
        
        self.d, y, gcd = RSA.extended_euclid(self.e, self.phi)
        
        self.e //= gcd
        if (self.d < 0): self.d += self.phi
    
    @staticmethod
    def extended_euclid(a: int, b: int, s: int = 1, t: int = 0, u: int = 0, v: int = 1) -> Tuple[int, int, int]:
        """Extended euclid finding Bezout's identity
        Returning x, y and gcd(a, b)
        """
        if b == 0:
            return (s, t, a)
        q = a // b
        return RSA.extended_euclid(b, a % b, u, v, s - q * u, t - q * v)
        
    def encrypt(self, message: Union[int, str]) -> str:
        """Cipher the text"""
        if isinstance(message, str):
            if len(message) > 56:
                raise ValueError("Message too long")
            message = RSA.string_to_number(message)
        return RSA.power(message, self.e, self.n)

    def decrypt(self, cyphered_text: int) -> int:
        """Decrypt the text"""
        return RSA.power(cyphered_text, self.d, self.n)

    @staticmethod
    def get_large_p_q(n: int) -> Tuple[int, int]:
        """Get large prime numbers p and q"""
        while True:
            p = RSA.generate_prime_number(n)
            q = RSA.generate_prime_number(n)
            if (p != q): return (p, q)
            
    @staticmethod
    def generate_prime_number(n: int) -> int:
        # Generate a random prime number from 1 to n
        while True:
            # The probability of getting a prime number is approximately n / lg(n)
            x = random.randint(1, n)
            if RSA.isPrime(x):
                return x
    
    @staticmethod
    def isPrime(n: int) -> bool:
        """Check if a number is prime using Miller-Rabin primality test algorithm
        Time complexity: O(k * log^3(n)) where k is the number of iterations
        In this case, k = 13, so the time complexity is O(log^3(n)) with constant C = 13
        """
        if (n < 2 or n % 6 % 4 != 1):
            return bool((n | 1) == 3)
        # Reference: https://en.wikipedia.org/wiki/Miller%E2%80%93Rabin_primality_test#Testing_against_small_sets_of_bases
        A = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 97, 101]
        d = n - 1
        s = 0
        while (d & 1 == 0):
            s += 1
            d >>= 1
        for a in A:
            p = RSA.power(a % n, d, n)
            i = s
            while (p != 1 and p != n - 1 and a % n and i > 0):
                i -= 1
                p = p * p % n
            if (p != n - 1 and i != s):
                return False
        return True
    
    