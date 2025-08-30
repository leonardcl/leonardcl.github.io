// import { Link } from "react-router-dom"
// import Navbar from './components/NavBar'
import ReactMarkdown from "react-markdown"
// import marked from "marked";
import { useEffect, useState } from "react";
// import markdown from '/article_rl.md';
import "highlight.js/styles/a11y-dark.css";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import style from './markdown-styles.module.css';
// import MarkdownNavbar from 'markdown-navbar';
import Navbar from '../NavBar'
import Footer from "../Footer";

// The default style of markdown-navbar should be imported additionally
// import 'markdown-navbar/dist/navbar.css';
// import styleNav from './markdown-styles-nav.module.css';


const RlFundamentalConcept1 = () => {
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        fetch("/1-rl-fundamental/article_rl.md")
        .then((response) => response.text())
        .then((text) => setMarkdown(text));
    }, []);

    // const markdownText = `
    // # 안녕하세요!
    // 저는 현재 리액트에서 \`react-markdown\`를 이용하여 **마크다운**을 랜더링하고 있습니다.
    // `;
      
    return (
        // <div className="flex flex-col md:flex-row border border-gray-200 rounded-lg">
        //     <div className="w-full pl-2 md:pl-5 xl:pl-40 pr-2 md:pr-5 xl:pr-40 mb-20">
        //     <div className=" flex text-3xl font-sans mb-4 text-left border-b-2 border-grey-500 pl-4">
        //         <div className="">
        //         <p className="text-gray-100 text-2xl sm:text-4xl transition-all duration-400 ease-in-out hover:text-green-500">Reinforcement Learning Basic</p>
        //         </div>
        //     </div>
        //     <p className="text-xl text-gray-400 p-2 text-wrap">
        //         Experience in Conputer Vision, Reinforcement Leanring, and Finance Application.
        //         <br></br>
        //     </p>
        //     </div>
        // </div>

        <div id="content" className="h-sceeen w-full font-quicksand">
            <Navbar />
            <div className="text-gray-300 text-left p-10 md:pl-40 md:pr-40 md:pb-40 flex flex-col md:flex-row">
                {/* <div className={`md:w-1/4 pt-20`}>
                    <MarkdownNavbar source={markdown} className={styleNav.markdown_navigation}/>
                </div> */}
                {/* <div className="md:w-3/4" style={{ maxWidth: "800px", width: "100%" }}> */}
                <div className="prose" style={{ maxWidth: "800px", width: "100%" }}>
                    <ReactMarkdown 
                        remarkPlugins={[remarkMath]} 
                        rehypePlugins={[rehypeHighlight, rehypeRaw, rehypeKatex]} 
                        className={`${style.reactMarkDown} markdown`}>
                        {markdown}
                    </ReactMarkdown>
                </div>
            </div>
            <Footer />
        </div>
    )
  }

  export default RlFundamentalConcept1