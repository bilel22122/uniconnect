'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Camera, Loader2, User, UploadCloud } from 'lucide-react';
import Image from 'next/image';

type AvatarUploadProps = {
    url: string | null;
    onUpload: (url: string) => void;
    size?: number;
};

export default function AvatarUpload({ url, onUpload, size = 150 }: AvatarUploadProps) {
    const supabase = createClient();
    const [uploading, setUploading] = useState(false);

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('User not authenticatd.');
            }

            const file = event.target.files[0];
            // Fix: Unique path per user to prevent overwriting others' avatars
            const filePath = `${user.id}/${Date.now()}_${file.name}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            if (data) {
                onUpload(data.publicUrl);
            }

        } catch (error: any) {
            alert('Error uploading avatar: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div
                className="relative rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md group"
                style={{ width: size, height: size }}
            >
                {url ? (
                    <img
                        src={url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <User className="w-1/2 h-1/2" />
                    </div>
                )}

                {/* Overlay while uploading */}
                {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                )}

                {/* Overlay on hover for instruction */}
                {!uploading && (
                    <label className="absolute inset-0 bg-black/0 group-hover:bg-black/20 cursor-pointer flex items-center justify-center transition-all z-10" htmlFor="single">
                        <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 drop-shadow-md transition-all scale-75 group-hover:scale-100" />
                    </label>
                )}
            </div>

            <div>
                <label
                    className={`
            cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm
            ${uploading
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-secondary hover:text-primary'
                        }
          `}
                    htmlFor="single"
                >
                    {uploading ? (
                        'Uploading...'
                    ) : (
                        <>
                            <UploadCloud className="w-4 h-4" />
                            Upload Photo
                        </>
                    )}
                </label>
                <input
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                    }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                />
            </div>
        </div>
    );
}
