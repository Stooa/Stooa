<?php
/*
namespace App\Factory;

use App\Entity\User;
use Zenstruck\Foundry\ModelFactory;

final class UserFactory extends ModelFactory
{
    protected function getDefaults(): array
    {
        return [
name
surnames
email
roles
password
privacyPolicy
allowShareData
active
linkedinProfile
twitterProfile
locale
fishbowls
plainPassword

            'name' => self::faker()->title(),
            'description' => self::faker()->sentence(),
            'startDateTime' => self::faker()->dateTime(),
            'timezone' => self::faker()->timezone(),
            'locale' => self::faker()->languageCode(),
            'duration' => self::faker()->dateTime(),
            'currentStatus' => self::faker()->randomElement(Fishbowl::$statusChoices),
        ];
    }

    protected static function getClass(): string
    {
        return User::class;
    }
} -->
