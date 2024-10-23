import { PostEditor } from "@/components/posts/editor/PostEditor";
import TrendsSideBar from "@/components/TrendsSideBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";
import ForYouFeed from "./ForYouFeed";

export default async function Home() {


  return (
    <main className="w-full flex gap-5">
      <div className=" w-full space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For You </TabsTrigger>
            <TabsTrigger value="following">Following </TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
              <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
              <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSideBar />
    </main>
  );
}
