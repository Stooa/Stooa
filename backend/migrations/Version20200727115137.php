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

final class Version20200727115137 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("INSERT INTO fos_user__user (username, username_canonical, email, email_canonical, enabled, salt, password, roles, created_at, updated_at) VALUES ('admin', 'admin', 'admin@localhost', 'admin@localhost', 1, 'Jm20EnPsPVdrPG.6l.U5IOdYOZWSirX3r40pw4kpAko', '\$argon2id\$v=19\$m=65536,t=4,p=1\$yszqXGIYre2ajyy65+qlkw\$DYsEDLsYoNAw4c4zlcZHmZ8dUEvKQvLnOVn40oYqWlM', 'a:1:{i:0;s:16:\"ROLE_SUPER_ADMIN\";}', '2018-01-08 09:56:07', '2018-01-08 09:56:07')");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DELETE FROM fos_user__user');
    }
}
