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

namespace App\Core\Tests\Unit;

use App\Core\Factory\UserFactory;
use App\Core\Model\ResetPassword;
use App\Core\Service\MailerService;
use App\Fishbowl\Factory\FishbowlFactory;
use App\Fishbowl\Service\PrivateFishbowlService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\MockObject\Stub;
use PHPUnit\Framework\TestCase;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use SymfonyCasts\Bundle\ResetPassword\Model\ResetPasswordToken;
use Zenstruck\Foundry\Test\Factories;

class MailServiceTest extends TestCase
{
    use Factories;

    /** @var MockObject&MailerInterface */
    private MockObject $mailer;
    /** @var TranslatorInterface&Stub */
    private Stub $translator;
    /** @var PrivateFishbowlService&Stub */
    private Stub $privateFishbowlService;
    private MailerService $service;
    private string $from;
    private string $appUrl;

    protected function setUp(): void
    {
        $this->mailer = $this->createMock(MailerInterface::class);
        $this->translator = $this->createStub(TranslatorInterface::class);
        $this->privateFishbowlService = $this->createStub(PrivateFishbowlService::class);

        $this->from = 'stooa@stooa.com';
        $this->appUrl = 'appUrl';
        $this->service = new MailerService(
            $this->mailer,
            $this->translator,
            $this->privateFishbowlService,
            $this->from,
            $this->appUrl
        );
    }

    /** @test */
    public function itSendsWelcomeEmail(): void
    {
        $user = UserFactory::createOne()->object();

        $this->translator->method('trans')->willReturn('Stooa');
        $this->translator->method('trans')->willReturn('Welcome to Stooa');
        $this->mailer->expects(static::once())->method('send')->with(static::isInstanceOf(TemplatedEmail::class));

        $this->service->sendWelcomeEmail($user);
    }

    /** @test */
    public function itSendsPasswordEmail(): void
    {
        $user = UserFactory::createOne()->object();

        $date = new \DateTimeImmutable();
        $resetToken = new ResetPasswordToken('token', $date, $date->getTimestamp());
        $resetPassword = new ResetPassword();

        $this->translator->method('trans')->willReturn('Stooa');
        $this->translator->method('trans')->willReturn('Welcome to Stooa');

        $this->mailer->expects(static::once())->method('send')->with(static::isInstanceOf(TemplatedEmail::class));

        $this->service->sendResetPasswordEmail($user, $resetToken, $resetPassword);
    }

    /** @test */
    public function itSendsFishbowlCreatedMail(): void
    {
        $user = UserFactory::createOne()->object();
        $fishbowl = FishbowlFactory::createOne([
            'host' => $user,
            'finishDateTime' => new \DateTimeImmutable(),
        ])->object();

        $this->translator->method('trans')->willReturn('Stooa');
        $this->translator->method('trans')->willReturn('Welcome to Stooa');

        $this->mailer->expects(static::once())->method('send')->with(static::isInstanceOf(TemplatedEmail::class));

        $this->service->sendFishbowlCreatedEmail($fishbowl);
    }

    /** @test */
    public function itSendsPrivateFishbowlCreatedMail(): void
    {
        $user = UserFactory::createOne()->object();
        $fishbowl = FishbowlFactory::createOne([
            'host' => $user,
            'isPrivate' => true,
            'plainPassword' => 'password',
            'finishDateTime' => new \DateTimeImmutable(),
        ])->object();

        $this->translator->method('trans')->willReturn('Stooa');
        $this->translator->method('trans')->willReturn('Welcome to Stooa');

        $this->privateFishbowlService->method('decryptPrivatePassword')->willReturn($fishbowl);

        $this->mailer->expects(static::once())->method('send')->with(static::isInstanceOf(TemplatedEmail::class));

        $this->service->sendFishbowlCreatedEmail($fishbowl);
    }
}
