import { AppProvider } from '@/app/context/app--context';
import { HomePage } from '@/components/app/home-page';

export default function StudioPage() {
    return (
        <AppProvider>
            <HomePage />
        </AppProvider>
    );
}
