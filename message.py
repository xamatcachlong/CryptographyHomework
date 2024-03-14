from rsa import RSA

Session = RSA()

Session.create()

# print(Session)

message = "A quick brown fox jumps over the lazy dog!"

x = Session.encrypt(message)

y = Session.decrypt(x)
message_decrypted = RSA.number_to_string(y)
print("Decrypted:", message_decrypted)