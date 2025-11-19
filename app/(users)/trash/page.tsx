import { Metadata } from 'next';
import { TrashClient } from './components/trash-client';

export const metadata: Metadata = {
  title: 'My Trash',
};

export default function Page() {
  return <TrashClient />;
}
