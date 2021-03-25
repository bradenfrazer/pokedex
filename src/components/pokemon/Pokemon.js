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
    frontUrl: "",
    shinyUrl: "",
    backUrl: "",
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

    // Urls for pokemon info
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

    //get pokemon info
    const pokemonRes = await axios.get(pokemonUrl);

    const name = pokemonRes.data.name;
    const frontUrl = pokemonRes.data.sprites.front_default;
    const shinyUrl = pokemonRes.data.sprites.front_shiny;
    const backUrl = pokemonRes.data.sprites.back_default;

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

    await axios.get(pokemonSpeciesUrl).then((res) => {
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
      frontUrl,
      shinyUrl,
      backUrl,
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
        <div className="bg-white nes-container with-title">
            <h5 className="title">#{this.state.pokemonIndex}</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 md:gap-8 items-center">
                <div className="sm:col-span-2 md:col-span-3 md:order-3">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <h4 className="mx-auto">
                            {this.state.name
                                .toLowerCase()
                                .split("-")
                                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                                .join(" ")}
                            </h4>
                        </div>
                        <div className="lg:flex lg:justify-end">
                            {this.state.types.map((type) => (
                                <div className="nes-badge"> 
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
                    <div className="my-4">
                        <div className="grid grid-cols-6 gap-4">
                            <div className="col-span-2">HP</div>
                            <div className="col-span-1">{this.state.stats.hp}</div>
                            <div className="col-span-3 items-center">
                                <progress
                                    className="nes-progress"
                                    value={this.state.stats.hp}
                                    max="255"
                                >
                                </progress>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                            <div className="col-span-2">Attack</div>
                            <div className="col-span-1">{this.state.stats.attack}</div>
                            <div className="col-span-3 items-center">
                                <progress
                                    className="nes-progress"
                                    value={this.state.stats.attack}
                                    max="255"
                                >
                                </progress>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                            <div className="col-span-2">Defense</div>
                            <div className="col-span-1">{this.state.stats.defense}</div>
                            <div className="col-span-3 items-center">
                                <progress
                                    className="nes-progress"
                                    value={this.state.stats.defense}
                                    max="255"
                                >
                                </progress>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                            <div className="col-span-2">Speed</div>
                            <div className="col-span-1">{this.state.stats.speed}</div>
                            <div className="col-span-3 items-center">
                                <progress
                                    className="nes-progress"
                                    value={this.state.stats.speed}
                                    max="255"
                                >
                                </progress>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                            <div className="col-span-2">Sp. Atk.</div>
                            <div className="col-span-1">{this.state.stats.specialAttack}</div>
                            <div className="col-span-3 items-center">
                                <progress
                                    className="nes-progress"
                                    value={this.state.stats.specialAttack}
                                    max="255"
                                >
                                </progress>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                            <div className="col-span-2">Sp. Def.</div>
                            <div className="col-span-1">{this.state.stats.specialDefense}</div>
                            <div className="col-span-3 items-center">
                                <progress
                                    className="nes-progress"
                                    value={this.state.stats.specialDefense}
                                    max="255"
                                >
                                </progress>
                            </div>
                        </div>
                    </div>
                    <p className="text-center"><small>Base Stats</small></p>
                </div>
                <div className="sm:col-span-1 md:col-span-2 md:order-1">
                    <img
                    src={this.state.frontUrl}
                    className="card-img-top rounded mx-auto w-full"
                    />
                    <p className="text-center"><small>Default</small></p>
                </div>
                <div className="sm:col-span-1 md:col-span-1 md:order-2 grid grid-cols-2 md:grid-cols-1">
                    <div>
                        <img
                        src={this.state.backUrl}
                        className="card-img-top rounded mx-auto w-full"
                        />
                        <p className="text-center"><small>Back</small></p>
                    </div>
                    <div>
                        <img
                        src={this.state.shinyUrl}
                        className="card-img-top rounded mx-auto w-full"
                        />
                        <p className="text-center"><small>Shiny</small></p>
                    </div>
              </div>
            </div>
            <div className="nes-container with-title is-rounded">
                <p className="title">Description</p>
                <p>{this.state.description}</p>
            </div>
            <hr />
            <div className="nes-container with-title my-4">
                <p className="title">Profile</p>

                <div class="nes-table-responsive grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <table class="nes-table">
                        <tbody>
                        <tr>
                            <td>Height:</td>
                            <td>{this.state.height} ft.</td>
                        </tr>
                        <tr>
                            <td>Weight:</td>
                            <td>{this.state.weight} lbs</td>
                        </tr>
                        <tr>
                            <td>Catch Rate:</td>
                            <td>{this.state.catchRate}%</td>
                        </tr>
                        <tr>
                            <td>Gender Ratio:</td>
                            <td>
                                { this.state.genderRatioFemale >= 0 ? 
                                    <div>
                                        <span>{this.state.genderRatioFemale}% Female</span>
                                        <progress
                                                className="nes-progress is-error"
                                                value={this.state.genderRatioFemale}
                                                max="100"
                                        >
                                        </progress>
                                        <span>{this.state.genderRatioMale}% Male</span>
                                        <progress
                                                className="nes-progress is-primary"
                                                value={this.state.genderRatioMale}
                                                max="100"
                                        >
                                        </progress>
                                    </div>
                                    :
                                    <span>Genderless</span>
                                }
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <table class="nes-table">
                        <tbody>
                        <tr>
                            <td>Egg Groups:</td>
                            <td>{this.state.eggGroups}</td>
                        </tr>
                        <tr>
                            <td>Hatch Steps:</td>
                            <td>{this.state.hatchSteps}</td>
                        </tr>
                        <tr>
                            <td>Abilities:</td>
                            <td>{this.state.abilities}</td>
                        </tr>
                        <tr>
                            <td>EVs:</td>
                            <td>{this.state.evs}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        <p className="text-gray-500 pt-4">
            <small>Data From{" "}
                <a href="https://pokeapi.co/" target="_blank" className="card-link">
                PokeAPI.co
                </a>
            </small>
        </p>
    </div>
    );
  }
}
