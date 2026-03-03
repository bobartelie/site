import baseLayout from "./base.layout";
import about from "./sections/about";
import community from "./sections/community";
import courses from "./sections/courses";
import faq from "./sections/faq";
import gallery from "./sections/gallery";
import hero from "./sections/hero";
import testimonials from "./sections/testimonials";

export default baseLayout( /*html*/`
    ${hero}
    ${courses}
    ${about}
    ${testimonials}
    ${gallery}
    ${faq}
    ${community}
`)