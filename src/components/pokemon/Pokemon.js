import React, { Component } from "react";
import axios from "axios";

const TYPE_COLORS = {
  bug: "B1C12E",
  dark: "4F3A2D",
  dragon: "755EDF",
  electric: "FCBC17",
  fairy: "F4B1F4",
  fighting: "823551D",
  fire: "E73B0C",
  flying: "A3B3F7",
  ghost: "6060B2",
  grass: "74C236",
  ground: "D3B357",
  ice: "A3E7FD",
  normal: "C8C4BC",
  poison: "934594",
  psychic: "ED4882",
  rock: "B9A156",
  steel: "B5B5C3",
  water: "3295F6",
};

export default class Pokemon extends Component {
  state = {
    name: "",
    pokemonIndex: "",
    frontURL: "",
    shinyURL: "",
    backURL: "",
    types: [],
    description: "",
    stats: {
      hp: "",
      attack: "",
      defense: "",
      speed: "",
      specialAttack: "",
      specialDefense: "",
    },
    height: "",
    weight: "",
    eggGroups: "",
    abilities: "",
    genderRatioMale: "",
    genderRatioFemale: "",
    evs: "",
    hatchSteps: "",
  };

  async componentDidMount() {
    const { pokemonIndex } = this.props.match.params;

    // urls for pokemon info
    const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
    const pokemonSpeciesURL = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

    //get pokemon info
    const pokemonRes = await axios.get(pokemonURL);

    const name = pokemonRes.data.name;
    const frontURL = pokemonRes.data.sprites.front_default;
    const shinyURL = pokemonRes.data.sprites.front_shiny;
    const backURL = pokemonRes.data.sprites.back_default;

    let { hp, attack, defense, speed, specialAttack, specialDefense } = "";

    pokemonRes.data.stats.map((stat) => {
      switch (stat.stat.name) {
        case "hp":
          hp = stat["base_stat"];
          break;
        case "attack":
          attack = stat["base_stat"];
          break;
        case "defense":
          defense = stat["base_stat"];
          break;
        case "speed":
          speed = stat["base_stat"];
          break;
        case "special-attack":
          specialAttack = stat["base_stat"];
          break;
        case "special-defense":
          specialDefense = stat["base_stat"];
          break;
      }
    });

    // convert decimeters to feet... The + 0.001 * 100) / 100 is for rounding two decimal places
    const height =
      Math.round((pokemonRes.data.height * 0.328084 + 0.0001) * 100) / 100;

    // convert hectometers to pounds
    const weight =
      Math.round((pokemonRes.data.weight * 0.220462 + 0.0001) * 100) / 100;

    const types = pokemonRes.data.types.map((type) => type.type.name);

    const abilities = pokemonRes.data.abilities.map((ability) => {
      return ability.ability.name
        .toLowerCase()
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");
    })
    .join(', ');

    const evs = pokemonRes.data.stats
      .filter((stat) => {
        if (stat.effort > 0) {
          return true;
        } else {
          return false;
        }
      })
      .map((stat) => {
        return `${stat.effort} ${stat.stat.name
            .toLowerCase()
            .split("-")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ")
        }`;
      })
      .join(". ");

    //get Pokemon description, catch rate, egg groups, gender ratios, and hatch steps

    await axios.get(pokemonSpeciesURL).then((res) => {
      let description = "";
      res.data.flavor_text_entries.some((flavor) => {
        if (flavor.language.name === "en") {
          description = flavor.flavor_text;
          return;
        }
      });

      const femaleRate = res.data["gender_rate"];
      const genderRatioFemale = 12.5 * femaleRate;
      const genderRatioMale = 12.5 * (8 - femaleRate);

      const catchRate = Math.round((100 / 255) * res.data['capture_rate']);

      const eggGroups = res.data["egg_groups"]
        .map((group) => {
          return group.name
            .toLowerCase()
            .split("-")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");
        })
        .join(", ");

      const hatchSteps = 255 * (res.data["hatch_counter"] + 1);

      this.setState({
        description,
        genderRatioFemale,
        genderRatioMale,
        catchRate,
        eggGroups,
        hatchSteps,
      });
    });

    this.setState({
      frontURL,
      shinyURL,
      backURL,
      pokemonIndex,
      name,
      types,
      stats: {
        hp,
        attack,
        defense,
        speed,
        specialAttack,
        specialDefense,
      },
      height,
      weight,
      abilities,
      evs,
    });
  }

  render() {
    return (
      <div className="col">
        <div className="bg-white nes-container with-title">
            <h5 className="title">#{this.state.pokemonIndex}</h5>
            <div className="row align-items-center">
              <div className="col-md-3">
                <img
                  src={this.state.frontURL}
                  className="card-img-top rounded mx-auto"
                />
                <p className="text-center"><small>Default</small></p>
              </div>
              <div className="col-md-2">
                <img
                  src={this.state.shinyURL}
                  className="card-img-top rounded mx-auto"
                />
                <p className="text-center"><small>Shiny</small></p>
                <img
                  src={this.state.backURL}
                  className="card-img-top rounded mx-auto"
                />
                <p className="text-center"><small>Back</small></p>
              </div>
              <div className="col-md-7">
                  <div className="row">
                        <div className="col-md-6">
                            <h4 className="mx-auto">
                            {this.state.name
                                .toLowerCase()
                                .split("-")
                                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                                .join(" ")}
                            </h4>
                        </div>
                        <div className="col-md-6">
                            <div className="float-right">
                            {this.state.types.map((type) => (
                                <div className="nes-badge pr-1"> 
                                    <span
                                    key={type}
                                    className="is-primary"
                                    style={{
                                        backgroundColor: `#${TYPE_COLORS[type]}`,
                                        boxShadow: `0 .5em #${TYPE_COLORS[type]},0 -.5em #${TYPE_COLORS[type]},.5em 0 #${TYPE_COLORS[type]},-.5em 0 #${TYPE_COLORS[type]}`,
                                        color: "white",
                                    }}
                                    >
                                    {type
                                        .toLowerCase()
                                        .split("-")
                                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                                        .join(" ")}
                                    </span>
                                </div>
                            ))}
                            </div>
                        </div>
                  </div>
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">HP</div>
                  <div className="col-12 col-md-9 d-flex align-items-center">
                    <p className="mr-2 mb-0">{this.state.stats.hp}</p>
                    <progress
                        className="nes-progress"
                        value={this.state.stats.hp}
                        max="255"
                      >
                    </progress>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">Attack</div>
                  <div className="col-12 col-md-9 d-flex align-items-center">
                    <p className="mr-2 mb-0">{this.state.stats.attack}</p>
                    <progress
                        className="nes-progress"
                        value={this.state.stats.attack}
                        max="255"
                      >
                    </progress>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">Defense</div>
                  <div className="col-12 col-md-9 d-flex align-items-center">
                    <p className="mr-2 mb-0">{this.state.stats.defense}</p>
                    <progress
                        className="nes-progress"
                        value={this.state.stats.defense}
                        max="255"
                      >
                    </progress>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">Speed</div>
                  <div className="col-12 col-md-9 d-flex align-items-center">
                    <p className="mr-2 mb-0">{this.state.stats.speed}</p>
                    <progress
                        className="nes-progress"
                        value={this.state.stats.speed}
                        max="255"
                      >
                    </progress>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">Sp. Atk.</div>
                  <div className="col-12 col-md-9 d-flex align-items-center">
                    <p className="mr-2 mb-0">{this.state.stats.specialAttack}</p>
                    <progress
                        className="nes-progress"
                        value={this.state.stats.specialAttack}
                        max="255"
                      >
                    </progress>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">Sp. Def.</div>
                  <div className="col-12 col-md-9 d-flex align-items-center">
                    <p className="mr-2 mb-0">{this.state.stats.specialDefense}</p>
                    <progress
                        className="nes-progress"
                        value={this.state.stats.specialDefense}
                        max="255"
                      >
                    </progress>
                  </div>
                </div>
              </div>
              <div className="col-md-12 w-100">
                <div className="nes-container with-title is-rounded">
                  <p className="title">Description</p>
                  <p>{this.state.description}</p>
                </div>
              </div>
            </div>
          <hr />
            <h5 class="card-title text-center">Profile</h5>
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-6">
                    <p className="float-right">Height:</p>
                  </div>
                  <div className="col-6">
                    <p className="float-left">{this.state.height} ft.</p>
                  </div>
                  <div className="col-6">
                    <p className="float-right">Weight:</p>
                  </div>
                  <div className="col-6">
                    <p className="float-left">{this.state.weight} lbs</p>
                  </div>
                  <div className="col-6">
                    <p className="float-right">Catch Rate:</p>
                  </div>
                  <div className="col-6">
                    <p className="float-left">{this.state.catchRate}%</p>
                  </div>
                  <div className="col-6">
                    <p className="float-right">Gender Ratio:</p>
                  </div>
                  <div className="col-6">
                    <p className="mr-2 mb-0">{this.state.genderRatioFemale}% Female</p>
                    <progress
                            className="nes-progress is-error"
                            value={this.state.genderRatioFemale}
                            max="100"
                    >
                    </progress>
                    <p className="mr-2 mb-0">{this.state.genderRatioMale}% Male</p>
                    <progress
                            className="nes-progress is-primary"
                            value={this.state.genderRatioMale}
                            max="100"
                    >
                    </progress>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-6">
                    <p className="float-right">Egg Groups:</p>
                  </div>
                  <div className="col-6">
                    <p className="float-left">{this.state.eggGroups} </p>
                  </div>
                  <div className="col-6">
                    <p className="float-right">Hatch Steps:</p>
                  </div>
                  <div className="col-6">
                    <p className="float-left">{this.state.hatchSteps}</p>
                  </div>
                  <div className="col-6">
                    <p className="float-right">Abilities:</p>
                  </div>
                  <div className="col-6">
                    <p className="float-left">{this.state.abilities}</p>
                  </div>
                  <div className="col-6">
                    <p className="float-right">EVs:</p>
                  </div>
                  <div className="col-6">
                    <p className="float-left">{this.state.evs}</p>
                  </div>
                </div>
              </div>
            </div>
          <p class="text-muted">
            <small>Data From{" "}
                <a href="https://pokeapi.co/" target="_blank" className="card-link">
                PokeAPI.co
                </a>
            </small>
          </p>
        </div>
      </div>
    );
  }
}
