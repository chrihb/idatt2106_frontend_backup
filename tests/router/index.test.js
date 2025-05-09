import { mount } from '@vue/test-utils';
import mockRouter from "../mocks/MockRouter.js";
import Base from '@/views/Base.vue';
import AboutUsView from "@/views/AboutUsView.vue";
import i18n from "@/i18n.js";
import mockPinia from "../mocks/MockPinia.js";

describe('Router', () => {
    let wrapper;
    let router;

    beforeEach(async () => {
        router = mockRouter();
        wrapper = mount(Base, {
            global: {
                plugins: [i18n, router, mockPinia]
            }
        });

        await router.push('/');
        await router.isReady();
    });

    it('should have a route for the home page', () => {
        const homeRoute = router.resolve('/');
        expect(homeRoute.matched[0].components.default).toBe(Base);
    });

    it('should navigate to /news', async () => {
        await router.push('/news');
        expect(router.currentRoute.value.path).toBe('/news');
    });


    it('should navigate to /about-us', async () => {
        await router.push('/about-us');
        expect(router.currentRoute.value.path).toBe('/about-us');
    });
});
