import { getNews, getNewsByDistrict, getCaseDetails } from '@/services/newsService';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
vi.mock('@/stores/newsStore', () => ({
    useNewsStore: () => ({
        clearNews: vi.fn(),
        addNews: vi.fn(),
        noNewsFound: false,
    }),
}));

describe('newsService', () => {
    it('should fetch news successfully', async () => {
        axios.get.mockResolvedValue({ data: [{ id: 1, title: 'News 1' }] });

        await getNews();
        expect(axios.get).toHaveBeenCalledWith(`${window.backendURL}/api/news`);
    });

    it('should fetch news by district successfully', async () => {
        axios.get.mockResolvedValue({ data: [{ id: 2, title: 'District News' }] });

        await getNewsByDistrict('district-1');
        expect(axios.get).toHaveBeenCalledWith(`${window.backendURL}/api/news/district/district-1`);
    });
});
