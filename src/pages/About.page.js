import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

class AboutPage extends LitElement{
  static styles = css`
  #about{
    padding: 32px 10vmin;
    font-size: var(--body-font-size);
    font-family: Helvetica, Arial, sans-serif;
  }

  h2{
    font-size: var(--h2-font-size);
  }
  `;

  render(){
    return html`
    <div id="about">
      <h2>About this site</h2>
      <p>
      Hi! I'm a University student from Taiwan who major CS. IT Wolf is my fursona, also is my second identity of me on Internet. I love web dev stuff, and code, and love to understand the truth about a knowledge (you can take a look about my knowledge base at http://ljcucc.github.io/knowledge_base/)
      </p>
    </div>
    `;
  }
}

customElements.define("about-page-comp", AboutPage);