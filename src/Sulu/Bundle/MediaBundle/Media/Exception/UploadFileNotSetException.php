<?php

/*
 * This file is part of Sulu.
 *
 * (c) MASSIVE ART WebServices GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Bundle\MediaBundle\Media\Exception;

/**
 */
class UploadFileNotSetException extends UploadFileException
{
    /**
     * @param string $message
     */
    public function __construct($message)
    {
        parent::__construct($message, self::EXCEPTION_CODE_UPLOADED_FILE_NOT_FOUND);
    }
}
