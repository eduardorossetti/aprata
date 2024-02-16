import { useEffect } from 'react'

const useOutsideAlerter = (ref, inputRef, setShow, setSearch) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShow(false)
        setSearch('')
      }
    }
    // Bind the event listener
    document.addEventListener('click', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', handleClickOutside)
    }
  }, [ref, inputRef, setShow, setSearch])
}

export default useOutsideAlerter
