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
use Symfony\Component\DependencyInjection\ContainerAwareTrait;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230704100601 extends AbstractMigration implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->skipIf(
            'false' === $this->container->getParameter('world_cafe'),
            'Skipping migration because World Cafe is disabled'
        );

        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE question (id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', world_cafe_id CHAR(36) DEFAULT NULL COMMENT \'(DC2Type:uuid)\', position INT DEFAULT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, INDEX IDX_B6F7494E8855E250 (world_cafe_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE world_cafe (id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', host_id CHAR(36) DEFAULT NULL COMMENT \'(DC2Type:uuid)\', round_minutes INT DEFAULT 10 NOT NULL, current_round INT DEFAULT 1 NOT NULL, has_extra_round_time TINYINT(1) NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, slug VARCHAR(255) NOT NULL, start_date_time DATETIME NOT NULL, timezone VARCHAR(255) NOT NULL, locale VARCHAR(255) NOT NULL, current_status VARCHAR(255) DEFAULT \'not_started\' NOT NULL, finished_at DATETIME DEFAULT NULL, finish_date_time DATETIME DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_9179BDC4989D9B62 (slug), INDEX IDX_9179BDC41FB8D185 (host_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE world_cafe_topics (world_cafe_id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', topic_id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', INDEX IDX_7FD1EF68855E250 (world_cafe_id), INDEX IDX_7FD1EF61F55203D (topic_id), PRIMARY KEY(world_cafe_id, topic_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE question ADD CONSTRAINT FK_B6F7494E8855E250 FOREIGN KEY (world_cafe_id) REFERENCES world_cafe (id)');
        $this->addSql('ALTER TABLE world_cafe ADD CONSTRAINT FK_9179BDC41FB8D185 FOREIGN KEY (host_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE world_cafe_topics ADD CONSTRAINT FK_7FD1EF68855E250 FOREIGN KEY (world_cafe_id) REFERENCES world_cafe (id)');
        $this->addSql('ALTER TABLE world_cafe_topics ADD CONSTRAINT FK_7FD1EF61F55203D FOREIGN KEY (topic_id) REFERENCES topic (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE feedback ADD world_cafe_id CHAR(36) DEFAULT NULL COMMENT \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE feedback ADD CONSTRAINT FK_D22944588855E250 FOREIGN KEY (world_cafe_id) REFERENCES world_cafe (id)');
        $this->addSql('CREATE INDEX IDX_D22944588855E250 ON feedback (world_cafe_id)');
        $this->addSql('ALTER TABLE participant ADD world_cafe_id CHAR(36) DEFAULT NULL COMMENT \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE participant ADD CONSTRAINT FK_D79F6B118855E250 FOREIGN KEY (world_cafe_id) REFERENCES world_cafe (id)');
        $this->addSql('CREATE INDEX IDX_D79F6B118855E250 ON participant (world_cafe_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE feedback DROP FOREIGN KEY FK_D22944588855E250');
        $this->addSql('ALTER TABLE participant DROP FOREIGN KEY FK_D79F6B118855E250');
        $this->addSql('ALTER TABLE question DROP FOREIGN KEY FK_B6F7494E8855E250');
        $this->addSql('ALTER TABLE world_cafe DROP FOREIGN KEY FK_9179BDC41FB8D185');
        $this->addSql('ALTER TABLE world_cafe_topics DROP FOREIGN KEY FK_7FD1EF68855E250');
        $this->addSql('ALTER TABLE world_cafe_topics DROP FOREIGN KEY FK_7FD1EF61F55203D');
        $this->addSql('DROP TABLE question');
        $this->addSql('DROP TABLE world_cafe');
        $this->addSql('DROP TABLE world_cafe_topics');
        $this->addSql('DROP INDEX IDX_D22944588855E250 ON feedback');
        $this->addSql('ALTER TABLE feedback DROP world_cafe_id');
        $this->addSql('DROP INDEX IDX_D79F6B118855E250 ON participant');
        $this->addSql('ALTER TABLE participant DROP world_cafe_id');
    }
}
