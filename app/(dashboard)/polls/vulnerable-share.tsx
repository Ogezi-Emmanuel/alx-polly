"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, Share2, Twitter, Facebook, Mail } from "lucide-react";
import { toast } from "sonner";

export default function VulnerableShare() {
  /**
   * VulnerableShare component demonstrates sharing functionality for a poll.
   * It generates a shareable link and provides buttons for copying the link
   * and sharing on various social media platforms (Twitter, Facebook, Email).
   * NOTE: This component is named 'VulnerableShare' as a placeholder for potential
   * future security enhancements related to sharing mechanisms.
   */
  const [pollTitle, setPollTitle] = useState("My Awesome Poll"); // Placeholder for actual poll title
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // In a real application, you would fetch the actual poll title and generate the share URL dynamically.
    // For demonstration, we use a placeholder title and a dummy URL.
    const currentUrl = window.location.href;
    setShareUrl(`${currentUrl.split("/").slice(0, -1).join("/")}/poll-id-123`); // Example dummy URL
  }, []);

  const copyToClipboard = async () => {
    /**
     * Copies the generated share URL to the clipboard.
     * Displays a success toast notification on successful copy, or an error toast on failure.
     */
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareOnTwitter = () => {
    /**
     * Opens a new window to share the poll on Twitter.
     * Constructs the Twitter share URL with the poll title and share URL.
     */
    const text = encodeURIComponent(`Check out this poll: ${pollTitle}`);
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
    );
  };

  const shareOnFacebook = () => {
    /**
     * Opens a new window to share the poll on Facebook.
     * Constructs the Facebook share URL with the share URL.
     */
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
    );
  };

  const shareViaEmail = () => {
    /**
     * Opens the default email client to share the poll via email.
     * Constructs the mailto link with the poll title as subject and share URL in the body.
     */
    const subject = encodeURIComponent(`Poll: ${pollTitle}`);
    const body = encodeURIComponent(
      `Hi! I\'d like to share this poll with you: ${shareUrl}`,
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share This Poll
        </CardTitle>
        <CardDescription>
          Share your poll with others to gather votes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* URL Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Shareable Link
          </label>
          <div className="flex space-x-2">
            <Input
              value={shareUrl}
              readOnly
              className="font-mono text-sm"
              placeholder="Generating link..."
            />
            <Button onClick={copyToClipboard} variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Social Sharing Buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Share on social media
          </label>
          <div className="flex space-x-2">
            <Button
              onClick={shareOnTwitter}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              onClick={shareOnFacebook}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button
              onClick={shareViaEmail}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
