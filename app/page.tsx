import { AppProvider } from '@/app/context/app--context';
import { HomePageWithTimeline } from '@/components/app/home-page-with-timeline';

export default function Home() {
  return (
    <AppProvider>
      <HomePageWithTimeline />
    </AppProvider>
  );
}
