import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletConnect } from "@/components/WalletConnect";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "wagmi";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const handleAuth = async () => {
      if (isConnected && address) {
        // Sign in with wallet address
        const { error } = await supabase.auth.signInWithPassword({
          email: `${address.toLowerCase()}@wallet.local`,
          password: address.toLowerCase(),
        });

        if (error) {
          // If user doesn't exist, sign them up
          if (error.message.includes("Invalid login credentials")) {
            const { error: signUpError } = await supabase.auth.signUp({
              email: `${address.toLowerCase()}@wallet.local`,
              password: address.toLowerCase(),
            });

            if (signUpError) {
              toast({
                title: "Error",
                description: "Failed to create account. Please try again.",
                variant: "destructive",
              });
              return;
            }
          } else {
            toast({
              title: "Error",
              description: "Failed to sign in. Please try again.",
              variant: "destructive",
            });
            return;
          }
        }

        navigate("/");
        toast({
          title: "Welcome!",
          description: "You have successfully connected your wallet.",
        });
      }
    };

    handleAuth();
  }, [address, isConnected, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to Morocco Mole
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-center text-muted-foreground">
            Connect your wallet to continue
          </p>
          <WalletConnect />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;