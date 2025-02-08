from jwcrypto import jwk

key = jwk.JWK.generate(kty='RSA', size=2048)
private_key = key.export_private()
public_key = key.export_public()

print("PRIVATE KEY:")
print(private_key)

print("\nPUBLIC KEY:")
print(public_key)
