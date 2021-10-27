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

if (file_exists(dirname(__DIR__) . '/var/cache/prod/srcApp_KernelProdContainer.preload.php')) {
    require dirname(__DIR__) . '/var/cache/prod/srcApp_KernelProdContainer.preload.php';
}

if (file_exists(dirname(__DIR__) . '/var/cache/prod/App_KernelProdContainer.preload.php')) {
    require dirname(__DIR__) . '/var/cache/prod/App_KernelProdContainer.preload.php';
}
