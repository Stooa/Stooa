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

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200929155900 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE fishbowl ADD host_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE fishbowl ADD CONSTRAINT FK_BFA24D571FB8D185 FOREIGN KEY (host_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_BFA24D571FB8D185 ON fishbowl (host_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE fishbowl DROP FOREIGN KEY FK_BFA24D571FB8D185');
        $this->addSql('DROP INDEX IDX_BFA24D571FB8D185 ON fishbowl');
        $this->addSql('ALTER TABLE fishbowl DROP host_id');
    }
}
