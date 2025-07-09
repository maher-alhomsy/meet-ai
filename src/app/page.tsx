'use client';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { data: session } = authClient.useSession();

  const onSubmit = () => {
    authClient.signUp.email(
      { email, password, name },
      {
        onRequest(ctx) {
          console.log('On Request');
          console.log(ctx);
        },

        onSuccess(ctx) {
          console.log('On Success');
          console.log(ctx);
        },

        onError(ctx) {
          console.log('On Error');
          console.log(ctx);
        },
      }
    );
  };

  if (session) {
    return (
      <div className="flex flex-col p-4 gap-4">
        <p>Logged in as {session.user.name}</p>

        <Button onClick={() => authClient.signOut()}>Sign out</Button>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <Input
        value={name}
        placeholder="name"
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        type="email"
        value={email}
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        type="password"
        value={password}
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={onSubmit}>Create User</Button>
    </div>
  );
}
