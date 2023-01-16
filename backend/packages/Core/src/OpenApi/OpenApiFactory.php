<?php

declare(strict_types=1);

/*
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace App\Core\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\Model\Info;
use ApiPlatform\Core\OpenApi\Model\MediaType;
use ApiPlatform\Core\OpenApi\Model\Operation;
use ApiPlatform\Core\OpenApi\Model\PathItem;
use ApiPlatform\Core\OpenApi\Model\RequestBody;
use ApiPlatform\Core\OpenApi\Model\Response;
use ApiPlatform\Core\OpenApi\OpenApi;
use Symfony\Component\HttpFoundation\Response as HttpFoundationResponse;

final readonly class OpenApiFactory implements OpenApiFactoryInterface
{
    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }

    /** @param mixed[] $context */
    public function __invoke(array $context = []): OpenApi
    {
        $openApi = $this->decorated->__invoke($context);
        $schemas = $openApi->getComponents()->getSchemas() ?? new \ArrayObject();

        $schemas['Credentials'] = [
            'type' => 'object',
            'properties' => [
                'email' => [
                    'type' => 'string',
                    'example' => 'api@stooa.com',
                ],
                'password' => [
                    'type' => 'string',
                    'example' => 'api',
                ],
            ],
        ];

        $schemas['Token'] = [
            'type' => 'object',
            'properties' => [
                'token' => [
                    'type' => 'string',
                    'readOnly' => true,
                ],
                'refresh_token' => [
                    'type' => 'string',
                    'readOnly' => true,
                ],
            ],
        ];

        $schemas['RefreshToken'] = [
            'type' => 'object',
            'properties' => [
                'email' => [
                    'type' => 'string',
                    'example' => 'api',
                ],
                'refresh_token' => [
                    'type' => 'string',
                    'example' => 'api',
                ],
            ],
        ];

        $loginOperation = (new Operation('postCredentialsItem'))
            ->withTags(['Token'])
            ->withSummary('Get JWT token to login.')
            ->withRequestBody(new RequestBody('Create new JWT Token', new \ArrayObject([
                'application/json' => new MediaType(new \ArrayObject(['$ref' => '#/components/schemas/Credentials'])),
            ])))
            ->withResponses([
                HttpFoundationResponse::HTTP_OK => new Response('Get JWT token', new \ArrayObject([
                    'application/json' => new MediaType(new \ArrayObject(['$ref' => '#/components/schemas/Token'])),
                ])),
            ]);

        $refreshTokenOperation = (new Operation('postRefreshCredentialsItem'))
            ->withTags(['Token'])
            ->withSummary('Get JWT token.')
            ->withRequestBody(new RequestBody('Create new JWT Token given a refresh token', new \ArrayObject([
                'application/json' => new MediaType(new \ArrayObject(['$ref' => '#/components/schemas/RefreshToken'])),
            ])))
            ->withResponses([
                HttpFoundationResponse::HTTP_OK => new Response('Get JWT token', new \ArrayObject([
                    'application/json' => new MediaType(new \ArrayObject(['$ref' => '#/components/schemas/Token'])),
                ])),
            ]);

        $openApi = $openApi->withInfo(new Info('Stooa', 'v1'));

        $openApi->getComponents()->withSchemas($schemas);
        $openApi->getPaths()->addPath('/login', (new PathItem())->withPost($loginOperation));
        $openApi->getPaths()->addPath('/refresh-token', (new PathItem())->withPost($refreshTokenOperation));

        return $openApi;
    }
}
