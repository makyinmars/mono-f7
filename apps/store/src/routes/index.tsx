import ContentLayout from "@apps/store/components/common/content-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <ContentLayout>
      <div>Welcome to the Store!</div>
    </ContentLayout>
  );
}
