const animateOnScrollObserver = new IntersectionObserver(
    (entries, animateOnScrollObserver) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('enter')
                animateOnScrollObserver.unobserve(entry.target)
            }
        })
    }
)
const lazy = {
    mounted(el ){
        // setTimeout(() => {
            el.classList.add('before-enter')
        // } , binding.value * 1000)
        animateOnScrollObserver.observe(el)
    }
}
export default lazy;