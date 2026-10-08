import { AccountForm } from '@/components/auth/AccountForm';

/**
 * Ekran logowania — już tylko awaryjnie: gra startuje na anonimowym koncie,
 * a tu trafia się wyłącznie, gdy anonimowej sesji nie udało się założyć.
 */
export default function SignInScreen() {
  return <AccountForm variant="fallback" />;
}
