<template>
  <div class="container">
    <nuxt-link
      class="back-link"
      to="/"
    >&larr; back</nuxt-link>

    <h1 style="margin-top: 70px;">
      <div>
        <nuxt-link to="/">
          <span>Open Electricity</span>
        </nuxt-link>
      </div>
      
      Visualizing Portugal's electricity consumption including discriminated imports.
    </h1>

    <section class="about-section intro-section">
      <p>
        This website allows visualizing Portugal's electricity consumption patterns,
        taking into account both domestic generation and international exchanges.
      </p>

      <h2>Why?</h2>
      
      <p>
        The Portuguese electrical grid operator,
        <a
          href="https://ren.pt/"
          rel="external"
          target="_blank"
        >REN</a>,
        makes available some of the Portuguese electricity consumption data via its
        <a
          href="https://datahub.ren.pt/"
          rel="external"
          target="_blank"
        >REN Data Hub</a>
        page. This website aims to provide some functionality that the REN Data Hub doesn't provide:
      </p>

      <ol class="feature-list">
        <li>
          <strong>Imports discriminated by source.</strong> In many data hubs, imported 
          electricity is displayed in an aggregated fashion, which does not allow users 
          to know the true consumption by source of electricity. Access to this information 
          became increasingly important in recent years, due to the increasing reliance 
          of Portugal on imported electricity, which at times constitutes more than 40% 
          of the consumed amount. This is furthermore of interest in order to analyze the 
          carbon intensity of domestic consumption when accounting for imports.
        </li>
        <li>
          <strong>Ability to select custom/complex time intervals.</strong> Currently, many 
          data platforms only allow the selection of specific days or specific months for 
          which to inspect data. They do not allow the selection of other custom intervals. 
          Selecting these can be useful to inspect how the electricity mix varies in specific 
          contexts, like Winter or Summer (or potentially across multiple years), at nighttime 
          (e.g. 8pm-6am), Winter nighttime, etc.
        </li>
      </ol>

      <p>
        This website does not aim to replicate all the functionality that REN Data Hub or even others 
        like <a
          href="https://app.electricitymaps.com/"
          rel="external"
          target="_blank"
        >Electricity Maps</a> 
        (which is quite nice) already provide. Rather, it is meant to provide some of the 
        functionality they don't provide, such as the above referred discriminated imports 
        and custom/complex intervals.
      </p>

      <p>
        This is a personal project made in order to obtain some perspectives that are important 
        in order to evaluate the current electrical system policy in Portugal.
      </p>


      <h2>Methodology</h2>

      <h3>Data Source</h3>
      
      <p>
        The data is sourced from ENTSO-E, the European Network of Transmission System Operators 
        for Electricity. This website has access to all the data since 15/01/2015 (roughly the legal 
        start of the ENTSO-E data collection program), and is capable of fetching all the data till 
        the present time minus approximately 2 hours, by making use of the ENTSO-E API.
      </p>

      <h4>Approximations:</h4>
      
      <p>In order to tackle this problem, some approximations were made:</p>

      <ol class="feature-list">
        <li>
          <strong>The generated power is assumed to be distributed homogeneously throughout the grid, 
          per country.</strong> For example: taking Spain in isolation, we make the assumption 
          that the mix of electricity provided in any location in that country simply corresponds 
          to the overall mix for that country.
          <ul>
            <li>
              <strong>Corollary:</strong> The source mix of a cross-border export is the same 
              as the mix of electricity in the grid of the exporting country. This assumption 
              follows directly from the assumption above.
            </li>
            <li>
              This assumption greatly simplifies the problem, which would otherwise require 
              taking the topology of the grid into account (and data that is likely not available). 
              Such a project would be of a whole other scope.
            </li>
          </ul>
        </li>
        <li>
          <strong>Cross-border flows are assumed to be acyclic.</strong> If there is, for a given interconnector 
          (e.g., Spain-France), at any point in time, non-zero flows in both directions, then the 
          exports are assumed not to interfere with the imports. I.e. if a country is both importing 
          and exporting from/to another country at a given time, then the mix of flows is assumed 
          to have the same distribution as the source country's generation. As such, we are 
          discarding any "loop" effects, of flows that enter a country and go back to the country 
          of origin due to subpar transmission infrastructure.
          <ul>
            <li>
              This is in general a reasonable approximation to do due to the relatively good 
              domestic transmission networks of Portugal, Spain, and France. For the PT-ES and 
              ES-FR data, simultaneous flows in both directions were observed in only 2.2% and 
              1.6% of the hourly data points, respectively.
            </li>
            <li>
              However, Spain -> Portugal flows consider a recalculated Spanish grid mix that 
              takes the France -> Spain flows into account.
            </li>
          </ul>
        </li>
        <li>
          <strong>Only the contributions from Portugal's, Spain's and France's generation were considered.</strong>
          <ul>
            <li>
              Portugal's electricity imports are sizeable. In 2023, around 23% of the electricity 
              was imported. However, the French contribution represented only 0.5% of the supply, 
              and even during periods with total imports close to 48% of consumption the French 
              contribution stayed below 5%, so this approximation should have a small impact.
            </li>
          </ul>
        </li>
        <li>
          <strong>Resampling of Spanish/French generation/cross-border flow data to hourly granularity,</strong> 
          from their original 15 minute granularity. The need to resample follows from the different 
          Market Time Units (MTUs). The downsampling of Spanish/French data was performed by doing 
          a mean aggregation of each hour's four 15 minute blocks.
        </li>
      </ol>

      <h3>Model and Calculation</h3>
      
      <p>
        From the ENTSO-E API it is possible to request data and process it into the following variables:
      </p>

      <ul class="feature-list">
        <li>
          <strong>G<sub>t,s</sub><sup>X</sup></strong>: the generation matrix for country X. The rows (t) represent 
          the time (each hour) and the columns (s) represent the sources.
        </li>
        <li>
          <strong>F<sub>t</sub><sup>A→B</sup></strong>: a vector representing the (non-netted) cross-border total flows 
          from country A to country B. This vector contains one element for each hour being considered.
        </li>
      </ul>

      <p>
        We retrieve the generation matrices for Portugal, Spain and France, and the flow vectors for 
        Portugal-Spain and Spain-France (in both directions for each case).
      </p>

      <p>Based on the data and the approximations described above, we devised a simple model where, for each country:</p>

      <ol class="feature-list">
        <li>
          The relative weight of each source for each hourly timestamp is calculated by 
          <strong>G<sub>t,s</sub><sup>X</sup> / &Sigma;<sub>s</sub> G<sub>t,s</sub><sup>X</sup></strong> (for each country X).
        </li>
        <li>
          The exports per source are calculated by applying the relative weights to the total exports, 
          e.g. <strong>F<sub>t</sub><sup>FR→ES</sup> &times; (G<sub>t,s</sub><sup>FR</sup> / &Sigma;<sub>s</sub> G<sub>t,s</sub><sup>FR</sup>)</strong> 
          in the case of the exports from France to Spain.
        </li>
        <li>
          The imports per source are calculated in a similar fashion, e.g. 
          <strong>F<sub>t</sub><sup>ES→FR</sup> &times; (G<sub>t,s</sub><sup>ES</sup> / &Sigma;<sub>s</sub> G<sub>t,s</sub><sup>ES</sup>)</strong> 
          in the case of imports from Spain to France.
        </li>
        <li>
          The effective source mix on the grid is calculated by subtracting the exports (per source and time) 
          from the country's generation, and then adding the imports.
        </li>
      </ol>

      <p>
        We start by calculating the above for the Spain-France pair, in order to calculate the intermediary 
        grid mix for Spain, <strong>G<sub>t,s</sub><sup>ES&prime;</sup></strong>. We calculate the interactions for Portugal-Spain using 
        that intermediary Spanish grid mix. These two steps are represented in the expressions below:
      </p>

      <div class="formula-block">
        <p>
          <strong>G<sub>t,s</sub><sup>ES&prime;</sup></strong>
          =
          <strong>G<sub>t,s</sub><sup>ES</sup></strong>
          -
          <strong>F<sub>t</sub><sup>ES→FR</sup></strong>
          &times;
          <strong>(G<sub>t,s</sub><sup>ES</sup> / &Sigma;<sub>s</sub> G<sub>t,s</sub><sup>ES</sup>)</strong>
          +
          <strong>F<sub>t</sub><sup>FR→ES</sup></strong>
          &times;
          <strong>(G<sub>t,s</sub><sup>FR</sup> / &Sigma;<sub>s</sub> G<sub>t,s</sub><sup>FR</sup>)</strong>
        </p>

        <p>
          <strong>C<sub>t,s</sub><sup>PT</sup></strong>
          =
          <strong>G<sub>t,s</sub><sup>PT</sup></strong>
          -
          <strong>F<sub>t</sub><sup>PT→ES</sup></strong>
          &times;
          <strong>(G<sub>t,s</sub><sup>PT</sup> / &Sigma;<sub>s</sub> G<sub>t,s</sub><sup>PT</sup>)</strong>
          +
          <strong>F<sub>t</sub><sup>ES→PT</sup></strong>
          &times;
          <strong>(G<sub>t,s</sub><sup>ES&prime;</sup> / &Sigma;<sub>s</sub> G<sub>t,s</sub><sup>ES&prime;</sup>)</strong>
        </p>
      </div>

      <p>
        Where <strong>C<sub>t,s</sub><sup>PT</sup></strong> is the resulting Portuguese electricity aggregated consumption 
        matrix, indexed by time (hourly) and source. We can then use the whole expression to plot the 
        aggregated electricity consumption mix in Portugal accounting for the exports, or we can use each 
        of the terms in order to plot the Portuguese electricity consumption mix with the discriminated 
        generation contributions from each of the countries.
      </p>

      <div class="formula-block formula-system">
        <div class="formula-row">
          <div class="formula-operator lhs">
            <strong>C<sub>t,s</sub><sup>PT</sup></strong>
          </div>
          <div class="formula-expression" />
          <div
            class="formula-label"
            aria-hidden="true"
          />
        </div>

        <div class="formula-row">
          <div class="formula-operator equals">=</div>
          <div class="formula-expression">
            <span class="paren">
              (1 -
              <strong>F<sub>t</sub><sup>PT→ES</sup></strong>
              /
              &Sigma;<sub>s</sub> G<sub>t,s</sub><sup>PT</sup>)
            </span>
            &times;
            <strong>G<sub>t,s</sub><sup>PT</sup></strong>
          </div>
          <div class="formula-label">(Portuguese Contribution)</div>
        </div>

        <div class="formula-row">
          <div class="formula-operator plus">+</div>
          <div class="formula-expression">
            <span class="paren">
              <strong>F<sub>t</sub><sup>ES→PT</sup></strong>
              &times;
              (1 -
              <strong>F<sub>t</sub><sup>ES→FR</sup></strong>
              /
              &Sigma;<sub>s</sub> G<sub>t,s</sub><sup>ES</sup>)
            </span>
            /
            <span class="paren">
              (&Sigma;<sub>s</sub> G<sub>t,s</sub><sup>ES</sup>
              -
              <strong>F<sub>t</sub><sup>ES→FR</sup></strong>
              +
              <strong>F<sub>t</sub><sup>FR→ES</sup></strong>)
            </span>
            &times;
            <strong>G<sub>t,s</sub><sup>ES</sup></strong>
          </div>
          <div class="formula-label">(Spanish Contribution)</div>
        </div>

        <div class="formula-row">
          <div class="formula-operator plus">+</div>
          <div class="formula-expression">
            <strong>F<sub>t</sub><sup>ES→PT</sup></strong>
            &times;
            <span class="paren">
              <strong>F<sub>t</sub><sup>FR→ES</sup></strong>
              /
              &Sigma;<sub>s</sub> G<sub>t,s</sub><sup>FR</sup>
            </span>
            /
            <span class="paren">
              (&Sigma;<sub>s</sub> G<sub>t,s</sub><sup>ES</sup>
              -
              <strong>F<sub>t</sub><sup>ES→FR</sup></strong>
              +
              <strong>F<sub>t</sub><sup>FR→ES</sup></strong>)
            </span>
            &times;
            <strong>G<sub>t,s</sub><sup>FR</sup></strong>
          </div>
          <div class="formula-label">(French Contribution)</div>
        </div>
      </div>


      <h2>Features</h2>

      <ol class="feature-list">
        <li>
          <strong>Time intervals definition:</strong>
          <ul>
            <li><strong>Simple Interval Mode:</strong> Select a simple time range for which to retrieve data and analyze.</li>
            <li><strong>Advanced Pattern Mode:</strong> Allows specifying custom intervals, by applying constraints to data, to the years, months, days and hours fields.</li>
          </ul>
        </li>
        <li>
          <strong>Plot Types:</strong>
          <ul>
            <li><strong>Aggregated:</strong> Shows the overall consumption mix for Portugal, with the contributions by different countries all aggregated and grouped by source.</li>
            <li><strong>Discriminated:</strong> Displays the consumption mix grouped by country, and then by source.</li>
          </ul>
        </li>
      </ol>

      <h2>Notes</h2>

      <ul class="feature-list">
        <li>
          <strong>Hydro Pumped Storage consumption is not accounted for.</strong> For now, only source 
          generation values are represented. This means that, while Hydro Pumped Storage generation 
          is accounted into the graph, the consumption value relative to the upstream pumping of 
          water ("charging the reservoir") is not represented.
        </li>
        <li>
          <strong>Missing data handling:</strong> There are some hour timestamps where no data was 
          registered for some sources. Missing data is estimated via linear interpolation.
        </li>
      </ul>

      <section class="team-section">
        <h2>Authors</h2>
        <div class="team-member">
          <p class="name">Diogo Valada</p>
          <p class="role">Owner & Developer</p>
          <p class="links">
            <a 
              href="https://www.linkedin.com/in/diogovalada/" 
              rel="external"
              target="_blank">LinkedIn</a>
          </p>
        </div>
      </section>
    </section>

    <!-- <div class="sponsors">
      <section class="about-section eca-section">
        <img
          class="about-logos eca-logo"
          src="~/assets/img/eca_logo.png"
          alt="Energy Consumers Australia's logo"
        >
        <p>
          This project was co-funded by
          <a 
            href="http://energyconsumersaustralia.com.au/" 
            rel="external"
          >Energy Consumers Australia</a
          >
          as part of its grants process for consumer advocacy projects and
          research projects for the benefit of consumers of electricity and
          natural gas.
        </p>

      <section class="about-section eth-section">
        <img
          class="about-logos eth-logo"
          src="~/assets/img/eth-logo.png"
          alt="Energy Transition Hub's logo"
        >
        <p>
          This project is part of the University of Melbourne’s
          <a 
            href="http://climatecollege.unimelb.edu.au/" 
            rel="external"
          >Climate and Energy College</a
          >
          “Live-Emission tracker” project under the
          <a 
            href="http://www.energy-transition-hub.org/" 
            rel="external"
          >Energy Transition Hub</a
          >.
        </p>
      </section>
    </div> -->


  </div>
</template>

<script>
import AppLogo from '~/components/ui/Logo'
import OpenElectricityLogo from '~/components/ui/OpenElectricityLogo.vue';

export default {
  components: {
    AppLogo,
    OpenElectricityLogo
  },

  head: {
    titleTemplate: 'About Portugal Electricity'
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/variables.scss';
@import '~/assets/scss/responsive-mixins.scss';

.container {
  padding: 1rem;

  a {
    border-bottom: 1px dashed black;

    &:hover {
      border-bottom-style: solid;
    }
  }
}
.back-link {
  position: absolute;
  left: 4rem;
  top: 4rem;
}
h1 {
  text-align: center;
  font-size: 2rem;
  font-family: $header-font-family;
  font-weight: 700;
  margin: 2rem 0;

  .logo {
    width: 4.5rem;
    margin: 0 auto;
    display: block;
  }

  @include tablet {
    font-size: 2.5rem;
  }
}

.sponsors {
  .about-logos {
    width: 200px;
    display: block;
    margin: 0 auto 1rem;

    &.eca-logo {
      margin-top: 2rem;
    }
  }

  p {
    max-width: 300px;
    text-align: justify;
  }

  @include tablet {
    display: flex;

    .about-section {
      width: 50%;
      margin-top: 1rem;
    }
  }
}

.about-section {
  font-size: 0.9rem;
  text-align: center;

  &.intro-section {
    font-size: 1.2rem;
    border-bottom: 1px solid #ddd;

    h2 {
      font-size: 1.6rem;
      margin: 2.5rem auto 1.5rem;
      font-weight: 700;
      color: #2c3e50;
    }

    h3 {
      font-size: 1.3rem;
      margin: 2rem auto 1rem;
      font-weight: 600;
      color: #475569;
    }

    h4 {
      font-size: 1.1rem;
      margin: 1.5rem auto 0.75rem;
      font-weight: 600;
      color: #64748b;
    }

    .feature-list {
      text-align: left;
      max-width: 700px;
      margin: 1.5rem auto;
      padding-left: 1.5rem;

      li {
        margin: 1rem 0;
        line-height: 1.6;

        strong {
          color: #2c3e50;
        }

        ul {
          margin-top: 0.5rem;
          padding-left: 1.5rem;
          list-style-type: disc;

          li {
            margin: 0.5rem 0;
          }
        }
      }
    }
  }

  p {
    margin: 2rem auto;
  }

  p.credits {
    font-size: 0.8em;
    font-weight: 600;
    a {
      margin-left: 2px;
    }
  }
}

ul.feature-list {
  list-style-type: disc;
}

.social-links {
  a {
    border-bottom: 0;
    color: #aaa;
    font-size: 1.5rem;
    margin: 0 0.5rem;

    &:hover {
      color: #333;
    }
  }
}

.dev-links {
  a {
    border-bottom: 0;
    color: #aaa;
    font-size: 1.5rem;
    margin: 0 0.5rem;

    &:hover {
      color: #333;
    }
  }
}

.formula-block {
  background: #f8f9fb;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem auto;
  max-width: 720px;
  text-align: left;
  font-size: 1rem;
  line-height: 1.8;

  p {
    margin: 0.75rem 0;
  }

  strong {
    font-weight: 600;
  }

  &.formula-system {
    overflow-x: auto;
    .formula-row {
      display: grid;
      grid-template-columns: 3.5rem minmax(0, 1fr) auto;
      align-items: center;
      column-gap: 0.5rem;
      margin: 0.6rem 0;
      white-space: nowrap;
    }

    .formula-operator {
      text-align: right;
      font-weight: 700;
      padding-right: 0.25rem;

      &.lhs {
        text-align: right;
      }

      &.equals {
        font-weight: 700;
      }

      &.plus {
        font-weight: 700;
      }
    }

    .formula-expression {
      flex: 1;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .formula-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #475569;
      white-space: nowrap;
    }

    .paren {
      display: inline-block;
    }
  }
}

.team-section {
  margin: 2rem 0 3rem;
  padding: 2rem 0;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
  }

  .team-member {
    max-width: 420px;
    margin: 0 auto;
    padding: 2.5rem 2rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    }
  }

  .name {
    font-weight: 700;
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    letter-spacing: -0.02em;
  }

  .role {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 1.5rem;
    color: #64748b;
  }

  .bio {
    margin: 1rem 0;
    color: #475569;
    line-height: 1.6;
  }

  .links {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
    
    a {
      display: inline-flex;
      align-items: center;
      padding: 0.6rem 1.5rem;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white !important;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      border-bottom: none !important;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      }
    }
  }
}
</style>
