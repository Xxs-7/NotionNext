import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'

export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  const [highlightStyle, setHighlightStyle] = useState({ top: 0, height: 0 })
  const hasSubMenu = link?.subMenus?.length > 0
  const subMenuRef = useRef(null)
  const firstItemRef = useRef(null)

  // 初始化高亮条位置到第一个子菜单项
  const initializeHighlight = () => {
    if (firstItemRef.current && subMenuRef.current) {
      const containerTop = subMenuRef.current.getBoundingClientRect().top
      const firstItemTop = firstItemRef.current.getBoundingClientRect().top
      const firstItemHeight =
        firstItemRef.current.getBoundingClientRect().height

      setHighlightStyle({
        top: firstItemTop - containerTop,
        height: firstItemHeight
      })
    }
  }

  // 当子菜单显示时初始化高亮位置
  useEffect(() => {
    if (show && hasSubMenu) {
      const timer = setTimeout(initializeHighlight, 100)
      return () => clearTimeout(timer)
    }
  }, [show, hasSubMenu])

  const handleMouseEnter = (index, e) => {
    const target = e.currentTarget
    const containerTop = subMenuRef.current?.getBoundingClientRect().top || 0
    setHighlightStyle({
      top: target.getBoundingClientRect().top - containerTop,
      height: target.getBoundingClientRect().height
    })
  }

  const handleMouseLeave = () => {
    // 鼠标离开子菜单时回到第一个元素
    initializeHighlight()
  }

  if (!link || !link.show) {
    return null
  }

  return (
    <div
      onMouseOver={() => changeShow(true)}
      onMouseOut={() => changeShow(false)}>
      {/* 不含子菜单 */}
      {!hasSubMenu && (
        <Link
          target={link?.target}
          href={link?.href}
          className=' hover:bg-black hover:bg-opacity-10 rounded-2xl flex justify-center items-center px-3 py-1 no-underline tracking-widest'>
          {link?.icon && <i className={link?.icon} />} {link?.name}
        </Link>
      )}
      {/* 含子菜单的按钮 */}
      {hasSubMenu && (
        <>
          <div className='cursor-pointer  hover:bg-black hover:bg-opacity-10 rounded-2xl flex justify-center items-center px-3 py-1 no-underline tracking-widest'>
            {link?.name}
          </div>
        </>
      )}
      {/* 子菜单 */}
      {hasSubMenu && (
        <ul
          ref={subMenuRef}
          style={{ backdropFilter: 'blur(3px)' }}
          className={`${show ? 'visible opacity-100 top-10 left-1' : 'invisible opacity-0 overflow-hidden h-0'} absolute overflow-hidden rounded-xl dark:bg-[#1e1e1e] transition-all duration-300 drop-shadow-md border-primary border`}
          onMouseLeave={handleMouseLeave}>
          {/* 高亮条 */}
          <li
            className={`absolute left-0 w-full bg-primary rounded-md transition-all duration-300 ease-in-out`}
            style={{
              top: highlightStyle.top - 1,
              height: highlightStyle.height
              // opacity: show ? 0.2 : 0
            }}
          />

          {link.subMenus.map((sLink, index) => {
            return (
              <li
                key={index}
                ref={index === 0 ? firstItemRef : null}
                className='relative cursor-pointer tracking-widest transition-all duration-200 py-1 px-3 z-10'
                onMouseEnter={e => handleMouseEnter(index, e)}>
                <Link href={sLink.href} target={link?.target}>
                  <span className='text-sm text-nowrap font-extralight'>
                    {/* {link?.icon && <i className={sLink?.icon}> &nbsp; </i>} */}
                    {sLink.title}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
