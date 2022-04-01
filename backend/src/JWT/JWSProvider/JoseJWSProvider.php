<?php

namespace App\JWT\JWSProvider;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWSProvider\JWSProviderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\KeyLoader\KeyLoaderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Signature\CreatedJWS;
use Lexik\Bundle\JWTAuthenticationBundle\Signature\LoadedJWS;
use Namshi\JOSE\JWS;


final class JoseJWSProvider implements JWSProviderInterface
{
    private KeyLoaderInterface $keyLoader;
    private string $cryptoEngine;
    private string $signatureAlgorithm;
    private int $ttl;
    private int $clockSkew;

    public function __construct(KeyLoaderInterface $keyLoader, string $cryptoEngine, string $signatureAlgorithm, int $ttl, int $clockSkew)
    {
        $cryptoEngine = 'openssl' === $cryptoEngine ? 'OpenSSL' : 'SecLib';

        if (!$this->isAlgorithmSupportedForEngine($cryptoEngine, $signatureAlgorithm)) {
            throw new \InvalidArgumentException(sprintf('The algorithm "%s" is not supported for %s', $signatureAlgorithm, $cryptoEngine));
        }

        $this->keyLoader = $keyLoader;
        $this->cryptoEngine = $cryptoEngine;
        $this->signatureAlgorithm = $signatureAlgorithm;
        $this->ttl = $ttl;
        $this->clockSkew = $clockSkew;
    }

    public function create(array $payload, array $header = []): CreatedJWS
    {
        $header['alg'] = $this->signatureAlgorithm;

        $jws = new JWS($header, $this->cryptoEngine);

        $claims = ['iat' => time()];

        if (!isset($payload['exp'])) {
            $claims['exp'] = time() + $this->ttl;
        }

        $jws->setPayload($payload + $claims);
        
        $jws->sign(
            $this->keyLoader->loadKey('private'),
            $this->keyLoader->getPassphrase()
        );

        return new CreatedJWS($jws->getTokenString(), $jws->isSigned());
    }

    public function load($token): LoadedJWS
    {
        $jws = JWS::load($token, false, null, $this->cryptoEngine);

        return new LoadedJWS(
            $jws->getPayload(),
            $jws->verify($this->keyLoader->loadKey('public'), $this->signatureAlgorithm),
            null !== $this->ttl,
            $jws->getHeader(),
            $this->clockSkew
        );
    }

    private function isAlgorithmSupportedForEngine($cryptoEngine, $signatureAlgorithm)
    {
        $signerClass = sprintf('Namshi\\JOSE\\Signer\\%s\\%s', $cryptoEngine, $signatureAlgorithm);

        return class_exists($signerClass);
    }
}
