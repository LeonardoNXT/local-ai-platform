export interface OAuthButtonMethods {
  title: string;
  redirect_url: string;
  icon: React.FC;
}

export interface OAuthIntent {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  provider: string;
  email_verified: boolean;
}
