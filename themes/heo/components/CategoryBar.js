import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useRef, useState, useEffect } from 'react'

/**
 * 博客列表上方嵌入条
 * @param {*} props
 * @returns
 */
export default function CategoryBar(props) {
  const { categoryOptions, border = true } = props
  const { locale } = useGlobal()
  const [scrollRight, setScrollRight] = useState(false)
  const [hoverIndex, setHoverIndex] = useState(0)
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0 })
  // 创建一个ref引用
  const categoryBarItemsRef = useRef(null)
  const firstItemRef = useRef(null)

  // 初始化高亮条位置到第一个元素
  const initializeHighlight = () => {
    if (firstItemRef.current && categoryBarItemsRef.current) {
      const containerLeft =
        categoryBarItemsRef.current.getBoundingClientRect().left
      const firstItemLeft = firstItemRef.current.getBoundingClientRect().left
      const firstItemWidth = firstItemRef.current.getBoundingClientRect().width

      setHighlightStyle({
        left: firstItemLeft - containerLeft,
        width: firstItemWidth
      })
    }
  }
  // 点击#right时，滚动#category-bar-items到最右边
  const handleToggleScroll = () => {
    if (categoryBarItemsRef.current) {
      const { scrollWidth, clientWidth } = categoryBarItemsRef.current
      if (scrollRight) {
        categoryBarItemsRef.current.scrollLeft = 0
      } else {
        categoryBarItemsRef.current.scrollLeft = scrollWidth - clientWidth
      }
      setScrollRight(!scrollRight)
    }
  }

  // 组件挂载后初始化高亮位置
  useEffect(() => {
    const timer = setTimeout(initializeHighlight, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleMouseEnter = (index, e) => {
    const target = e.currentTarget
    const containerLeft =
      categoryBarItemsRef.current?.getBoundingClientRect().left || 0
    setHighlightStyle({
      left: target.getBoundingClientRect().left - containerLeft,
      width: target.getBoundingClientRect().width
    })
  }

  const handleMouseLeave = () => {
    // 鼠标离开时回到第一个元素
    initializeHighlight()
  }

  return (
    <div
      id='category-bar'
      className={`wow fadeInUp flex flex-nowrap justify-between items-center h-12 mb-4 space-x-2 w-full lg:bg-white dark:lg:bg-[#1e1e1e]  
            ${border ? 'lg:border lg:hover:border dark:lg:border-gray-800 hover:border-primary dark:hover:border-primary' : ''}  py-2 lg:px-2 rounded-xl transition-colors duration-200`}>
      <div
        id='category-bar-items'
        ref={categoryBarItemsRef}
        className='relative scroll-smooth max-w-4xl rounded-lg scroll-hidden flex justify-start flex-nowrap items-center overflow-x-scroll'
        onMouseLeave={handleMouseLeave}>
        {/* 高亮条 */}
        <div
          className={`absolute top-0 h-full bg-primary rounded-md transition-all duration-300 ease-in-out`}
          style={{
            left: highlightStyle.left,
            width: highlightStyle.width
          }}
        />

        <MenuItem
          href='/'
          name={locale.NAV.INDEX}
          index={0}
          onMouseEnter={handleMouseEnter}
          ref={firstItemRef}
        />
        {categoryOptions?.map((c, index) => (
          <MenuItem
            key={index}
            href={`/category/${c.name}`}
            name={c.name}
            index={index + 1}
            onMouseEnter={handleMouseEnter}
          />
        ))}
      </div>

      <div id='category-bar-next' className='flex items-center justify-center'>
        <div
          id='right'
          className='cursor-pointer mx-2 dark:text-gray-300 dark:hover:text-yellow-600 hover:text-indigo-600'
          onClick={handleToggleScroll}>
          {/* {scrollRight ? (
            <ChevronDoubleLeft className={'w-5 h-5'} />
          ) : (
            <ChevronDoubleRight className={'w-5 h-5'} />
          )} */}
        </div>
        <Link
          href='/category'
          className='whitespace-nowrap font-bold text-gray-900 dark:text-white transition-colors duration-200 hover:text-primary dark:hover:text-primary'>
          {locale.MENU.CATEGORY}
        </Link>
      </div>
    </div>
  )
}

/**
 * 按钮
 * @param {*} param0
 * @returns
 */
const MenuItem = React.forwardRef(
  ({ href, name, index, onMouseEnter }, ref) => {
    const router = useRouter()
    const { category } = router.query
    const selected = category === name

    const handleMouseEnter = e => {
      onMouseEnter(index, e)
    }

    return (
      <div
        ref={ref}
        className={`relative whitespace-nowrap mr-2 duration-200 transition-all font-bold px-2 py-0.5 rounded-md text-gray-900 dark:text-white hover:text-white z-10 ${selected ? 'text-white' : ''}`}
        onMouseEnter={handleMouseEnter}>
        <Link href={href}>{name}</Link>
      </div>
    )
  }
)

MenuItem.displayName = 'MenuItem'
