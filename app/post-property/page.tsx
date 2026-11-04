import { redirect } from 'next/navigation';

// Posting is admin-only. Old public links land on the admin area.
export default function PostPropertyRedirect() {
  redirect('/admin/post');
}
