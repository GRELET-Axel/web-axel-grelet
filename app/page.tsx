import Header from "./components/Header";
import Projects from "./components/Projects";
import Technologies from "./components/Technologies";
import Background3D from "./components/Background3D";


export default function Page() {
  return (
    <main>
      {/* <Background3D /> */}
      <Header />
      <Projects />
      <Technologies />
    </main>

  );
}