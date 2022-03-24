import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

class DashboardPage extends LitElement{
  static styles = css`
  h2.dashboard{
    font-size:var(--h2-font-size);
  }
  `;

  render(){
    return html`
    <div class="dashboard">
      <h2></h2>
    </div>
    `;
  }
}

customElements.define("dashboard-page", DashboardPage)