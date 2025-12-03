'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';

type IProps = {
  value: string | undefined;
  onChange: (value: string) => void;
};

export function PasswordInputField({ value, onChange }: IProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        value={value}
        placeholder="******"
        className="pr-10"
        onChange={e => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setShowPassword(prev => !prev)}
        className="absolute inset-y-0 cursor-pointer right-0 flex items-center pr-3 text-primary"
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}
