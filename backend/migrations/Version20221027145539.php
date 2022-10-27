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

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20221027145539 extends AbstractMigration implements ContainerAwareInterface
{
    private bool $skipMigration = true;

    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->skipIf(
            $this->skipMigration,
            'Skipping migration because World Cafe is disabled'
        );

        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE world_cafe (id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, slug VARCHAR(255) NOT NULL, start_date_time DATETIME NOT NULL, timezone VARCHAR(255) NOT NULL, locale VARCHAR(255) NOT NULL, duration TIME NOT NULL, introduced_at DATETIME DEFAULT NULL, runned_at DATETIME DEFAULT NULL, finished_at DATETIME DEFAULT NULL, finish_date_time DATETIME DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_9179BDC4989D9B62 (slug), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE world_cafe');
    }

    public function setContainer(ContainerInterface $container = null): void
    {
        $this->skipMigration = 'false' === $container->getParameter('world_cafe');
    }
}
