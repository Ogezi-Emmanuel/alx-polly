import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfilePageProps {
  user: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  return (
    <main className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.user_metadata?.avatar_url || "https://github.com/shadcn.png"} alt="User Avatar" />
            <AvatarFallback>{user.email?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{user.email}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">User ID:</span>
              <span>{user.id}</span>
            </div>
            {user.created_at && (
              <div className="flex items-center justify-between">
                <span className="font-semibold">Member Since:</span>
                <span>{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            )}
            {/* Add more user details here as needed */}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ProfilePage;