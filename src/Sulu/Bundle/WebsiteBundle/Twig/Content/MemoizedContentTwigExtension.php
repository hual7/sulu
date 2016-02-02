<?php

/*
 * This file is part of Sulu.
 *
 * (c) MASSIVE ART WebServices GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Bundle\WebsiteBundle\Twig\Content;

use Sulu\Component\Cache\MemoizeInterface;

/**
 * Provides memoized Interface to load content.
 */
class MemoizedContentTwigExtension extends \Twig_Extension implements ContentTwigExtensionInterface
{
    /**
     * @var ContentTwigExtensionInterface
     */
    private $extension;

    /**
     * @var MemoizeInterface
     */
    private $memoizeCache;

    /**
     * @var int
     */
    private $lifeTime;

    /**
     * Constructor.
     */
    public function __construct(ContentTwigExtensionInterface $extension, MemoizeInterface $memoizeCache, $lifeTime)
    {
        $this->extension = $extension;
        $this->memoizeCache = $memoizeCache;
        $this->lifeTime = $lifeTime;
    }

    /**
     * {@inheritdoc}
     */
    public function loadParent($uuid)
    {
        return $this->memoizeCache->memoize([$this->extension, 'loadParent'], $this->lifeTime);
    }

    /**
     * {@inheritdoc}
     */
    public function load($uuid)
    {
        return $this->memoizeCache->memoize([$this->extension, 'load'], $this->lifeTime);
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return $this->extension->getName();
    }

    /**
     * {@inheritdoc}
     */
    public function getFunctions()
    {
        return $this->extension->getFunctions();
    }
}
