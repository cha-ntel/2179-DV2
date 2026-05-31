const BLUE = "#2166ac";
const LIGHT_BLUE = "#67a9cf";
const RED = "#b2182b";
const ORANGE = "#f4a261";
const PALE_BLUE = "#9ecae1";
const NEUTRAL = "#d1d5db";

const REGION_DOMAIN = [
    "Melbourne - Inner",
    "Melbourne - West",
    "Geelong",
    "Mornington Peninsula",
    "Ballarat",
    "Bendigo",
    "Latrobe - Gippsland"
];

const REGION_RANGE = [
    "#c44e52",
    "#55a868",
    "#4c78a8",
    "#f2b447",
    "#8172b2",
    "#64b5cd",
    "#937860"
];

const CORE_REGIONS = REGION_DOMAIN;

const TREND_REGIONS = [
    "Melbourne - Inner",
    "Melbourne - West",
    "Geelong",
    "Mornington Peninsula"
];

const TREND_RANGE = [
    "#c44e52",
    "#55a868",
    "#4c78a8",
    "#f2b447"
];

const BASE_CONFIG = {
    background: null,

    font: "Inter",

    view: {
        stroke: null,
        fill: "transparent"
    },

    axis: {
        gridColor: "#e5e7eb",
        domain: false,
        tickColor: "#d1d5db",
        labelColor: "#64748b",
        titleColor: "#475569",
        labelFontSize: 12,
        titleFontSize: 13,
        labelFont: "Inter",
        titleFont: "Inter"
    },

    legend: {
        labelFontSize: 12,
        titleFontSize: 13,
        labelFont: "Inter",
        titleFont: "Inter"
    }
};

const mapChart = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 760,
    "height": 360,

    "title": {
        "text": "Internal migration gains and losses across Victoria",
        "subtitle": "Proportional symbol map of selected regions",
        "anchor": "start",
        "fontSize": 16,
        "subtitleFontSize": 11
    },

    "projection": {
        "type": "mercator",
        "center": [145.1, -37.7],
        "scale": 9000
    },

    "layer": [
        {
            "data": {
                "url": "Data/victoria_sa4.geojson",
                "format": {
                    "type": "json",
                    "property": "features"
                }
            },
            "mark": {
                "type": "geoshape",
                "fill": "#eef5fb",
                "stroke": "#94a3b8",
                "strokeWidth": 0.7
            }
        },
        {
            "data": {"url": "Data/map_migration.csv"},

            "transform": [
                {
                    "filter": {
                        "field": "Region",
                        "oneOf": CORE_REGIONS
                    }
                },
                {
                    "calculate": "abs(datum.Migration)",
                    "as": "MigrationSize"
                },
                {
                    "calculate":
                        "datum.Region === 'Melbourne - Inner' ? 'Inner' : " +
                        "datum.Region === 'Melbourne - West' ? 'West' : " +
                        "datum.Region === 'Mornington Peninsula' ? 'Mornington' : " +
                        "datum.Region === 'Latrobe - Gippsland' ? 'Latrobe' : datum.Region",
                    "as": "Label"
                }
            ],

            "mark": {
                "type": "circle",
                "opacity": 0.9,
                "stroke": "white",
                "strokeWidth": 2
            },

            "encoding": {
                "longitude": {"field": "Longitude", "type": "quantitative"},
                "latitude": {"field": "Latitude", "type": "quantitative"},

                "size": {
                    "field": "MigrationSize",
                    "type": "quantitative",
                    "scale": {
                        "domain": [0, 6000],
                        "range": [120, 2200]
                    },
                    "legend": {
                        "title": "Migration size",
                        "orient": "right",
                        "values": [0, 1000, 2000, 3000, 4000, 5000],
                        "labelExpr": "format(datum.value, ',')",
                        "symbolType": "circle",
                        "labelFontSize": 12,
                        "titleFontSize": 13
                    }
                },

                "color": {
                    "field": "Region",
                    "type": "nominal",
                    "scale": {
                        "domain": REGION_DOMAIN,
                        "range": REGION_RANGE
                    },
                    "legend": {
                        "title": "Region",
                        "orient": "right",
                        "symbolType": "circle",
                        "symbolSize": 150,
                        "labelFontSize": 12,
                        "titleFontSize": 13
                    }
                },

                "tooltip": [
                    {"field": "Region"},
                    {"field": "Migration", "title": "Net internal migration", "format": ","}
                ]
            }
        },
        {
            "data": {"url": "Data/map_migration.csv"},

            "transform": [
                {
                    "filter": {
                        "field": "Region",
                        "oneOf": [
                            "Melbourne - Inner",
                            "Melbourne - West",
                            "Geelong",
                            "Mornington Peninsula"
                        ]
                    }
                },
                {
                    "calculate":
                        "datum.Region === 'Melbourne - Inner' ? 'Inner' : " +
                        "datum.Region === 'Melbourne - West' ? 'West' : " +
                        "datum.Region === 'Mornington Peninsula' ? 'Mornington' : datum.Region",
                    "as": "Label"
                }
            ],

            "mark": {
                "type": "text",
                "fontSize": 12,
                "fontWeight": "700",
                "fill": "#1e293b"
            },

            "encoding": {
                "longitude": {"field": "Longitude", "type": "quantitative"},
                "latitude": {"field": "Latitude", "type": "quantitative"},
                "text": {"field": "Label"},
                "dx": {"value": 0},
                "dy": {"value": -22}
            }
        }, 
    ],

    "config": BASE_CONFIG
};

vegaEmbed("#mapVis", mapChart, {actions:false});

const barChart = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 420,
    "height": 500,
    "padding": {"left": 10, "right": 10, "top": 10, "bottom": 10},

    "data": {"url": "Data/migration_clean.csv"},

    "transform": [
        {"filter": {"field": "Region", "oneOf": CORE_REGIONS}},
        {
            "calculate":
                "datum.Region === 'Melbourne - Inner' ? 'Inner' : " +
                "datum.Region === 'Melbourne - West' ? 'West' : " +
                "datum.Region === 'Mornington Peninsula' ? 'Mornington' : " +
                "datum.Region === 'Latrobe - Gippsland' ? 'Latrobe' : datum.Region",
            "as": "ShortRegion"
        }
    ],

    "title": {
        "text": "Which regions gained and lost residents?",
        "subtitle": "Net internal migration, 2024–25",
        "anchor": "start",
        "fontSize": 16,
        "subtitleFontSize": 11
    },

    "layer": [
        {
            "mark": {"type": "rule", "color": "#334155", "strokeWidth": 1.5},
            "encoding": {"y": {"datum": 0}}
        },
        {
            "mark": {
                "type": "bar",
                "cornerRadiusTopLeft": 3,
                "cornerRadiusTopRight": 3
            },
            "encoding": {
                "x": {
                    "field": "ShortRegion",
                    "type": "nominal",
                    "sort": "-y",
                    "title": null,
                    "axis": {
                        "labelAngle": -35,
                        "labelFontSize": 11,
                        "labelLimit": 90
                    }
                },
                "y": {
                    "field": "Migration",
                    "type": "quantitative",
                    "title": "Net internal migration, 2024–25",
                    "scale": {"domain": [-7000, 5500]}
                },
                "color": {
                    "field": "Region",
                    "type": "nominal",
                    "scale": {"domain": REGION_DOMAIN, "range": REGION_RANGE},
                    "legend": {
                        "title": "Region",
                        "orient": "bottom",
                        "columns": 2,
                        "symbolType": "square",
                        "symbolSize": 150,
                        "labelFontSize": 12,
                        "titleFontSize": 13
                    }
                },
                "tooltip": [
                    {"field": "Region", "title": "Region"},
                    {"field": "Migration", "title": "Net internal migration", "format": ","}
                ]
            }
        },
        {
            "mark": {
                "type": "text",
                "fontSize": 11,
                "fontWeight": "700",
                "stroke": "white",
                "strokeWidth": 2
            },
            "encoding": {
                "x": {"field": "ShortRegion", "type": "nominal", "sort": "-y"},
                "y": {"field": "Migration", "type": "quantitative"},
                "text": {"field": "Migration", "format": ","},
                "dy": {
                    "condition": {
                        "test": "datum.Migration >= 0",
                        "value": -16
                    },
                    "value": 22
                }
                "color": {
                    "value": "#1e293b"
                }
            }
        }
    ],

    "config": BASE_CONFIG
};

vegaEmbed("#barVis", barChart, {actions:false});

const populationTrendChart = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 360,
    "height": 260,
    "padding": 8,

    "data": {"url": "Data/timeline_clean.csv"},

    "transform": [
        {
            "filter": {
                "field": "Region",
                "oneOf": TREND_REGIONS
            }
        },
        {
            "window": [
                {
                    "op": "first_value",
                    "field": "Population",
                    "as": "BasePopulation"
                }
            ],
            "groupby": ["Region"],
            "sort": [{"field": "Year", "order": "ascending"}]
        },
        {
            "calculate": "(datum.Population / datum.BasePopulation) * 100",
            "as": "PopulationIndex"
        }
    ],

    "title": {
        "text": "Population recovery",
        "subtitle": "Indexed population change since 2019",
        "anchor": "start",
        "fontSize": 16,
        "subtitleFontSize": 11
    },

    "mark": {
        "type": "line",
        "point": true,
        "strokeWidth": 3
    },

    "encoding": {
        "x": {
            "field": "Year",
            "type": "ordinal",
            "title": "Year"
        },

        "y": {
            "field": "PopulationIndex",
            "type": "quantitative",
            "title": "Index, 2019 = 100",
            "scale": {"domain": [85, 125]}
        },

        "color": {
            "field": "Region",
            "type": "nominal",
            "scale": {
                "domain": TREND_REGIONS,
                "range": TREND_RANGE
            },
            "legend": {
                "title": "Region",
                "orient": "bottom",
                "columns": 1
            }
        },

        "tooltip": [
            {"field": "Region", "title": "Region"},
            {"field": "Year", "title": "Year"},
            {"field": "Population", "title": "Population", "format": ","},
            {"field": "PopulationIndex", "title": "Index", "format": ".1f"}
        ]
    },

    "config": BASE_CONFIG
};

vegaEmbed("#populationTrendVis", populationTrendChart, {actions:false});

const migrationTrendChart = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 360,
    "height": 300,
    "padding": 8,

    "data": {"url": "Data/slope_clean.csv"},

    "transform": [
        {
            "filter": {
                "field": "Region",
                "oneOf": TREND_REGIONS
            }
        }
    ],

    "title": {
        "text": "Migration loss",
        "subtitle": "Internal migration gain/loss, 2021 vs 2025",
        "anchor": "start",
        "fontSize": 16,
        "subtitleFontSize": 11
    },

    "mark": {
    "type": "line",
    "point": {
        "filled": true,
        "size": 70
    },
    "strokeDash": [5, 4],
    "strokeWidth": 3
},

    "encoding": {
        "x": {
            "field": "Year",
            "type": "ordinal",
            "title": "Year"
        },

        "y": {
            "field": "Migration",
            "type": "quantitative",
            "title": "Net internal migration",
            "scale": {"domain": [-11000, 5500]}
        },

        "color": {
            "field": "Region",
            "type": "nominal",
            "scale": {
                "domain": TREND_REGIONS,
                "range": TREND_RANGE
            },
            "legend": {
                "title": "Region",
                "orient": "bottom",
                "columns": 1,
                "symbolType": "circle",
                "symbolSize": 180,
                "labelFontSize": 13,
                "titleFontSize": 14
            }
        },

        "tooltip": [
            {"field": "Region", "title": "Region"},
            {"field": "Year", "title": "Year"},
            {"field": "Migration", "title": "Net internal migration", "format": ","}
        ]
    },

    "config": BASE_CONFIG
};

vegaEmbed("#migrationTrendVis", migrationTrendChart, {actions:false});

const densityChart = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 390,
    "height": 300,
    "padding": 5,

    "data": {"url": "Data/density_clean.csv"},

    "title": {
        "text": "Density and migration tell different stories",
        "subtitle": "Population density vs migration",
        "anchor": "start",
        "fontSize": 16,
        "subtitleFontSize": 11
    },

    "layer": [
        {
            "mark": {
                "type": "rule",
                "color": "#94a3b8",
                "strokeDash": [4, 4]
            },
            "encoding": {
                "y": {"datum": 0}
            }
        },

        {
            "mark": {
                "type": "circle",
                "size": 850,
                "opacity": 0.9,
                "stroke": "white",
                "strokeWidth": 3
            },

            "encoding": {
                "x": {
                    "field": "Density",
                    "type": "quantitative",
                    "title": "Population density",
                    "scale": {"domain": [0, 9000]}
                },

                "y": {
                    "field": "Migration",
                    "type": "quantitative",
                    "title": "Net internal migration",
                    "scale": {"domain": [-7000, 5500]}
                },

                "color": {
                    "field": "Region",
                    "type": "nominal",
                    "scale": {
                        "domain": REGION_DOMAIN,
                        "range": REGION_RANGE
                    },
                    "legend": {
                        "title": "Region",
                        "orient": "bottom",
                        "columns": 2,
                        "symbolType": "circle",
                        "symbolSize": 160,
                        "labelFontSize": 12,
                        "titleFontSize": 13
                    }
                },

                "tooltip": [
                    {"field": "Region", "title": "Region"},
                    {"field": "Density", "title": "Population density", "format": ","},
                    {"field": "Migration", "title": "Net internal migration", "format": ","}
                ]
            }
        }
    ],

    "config": BASE_CONFIG
};

vegaEmbed("#densityVis", densityChart, {actions:false});

fetch("Data/population_size.csv")
    .then(response => response.text())
    .then(csvText => {
        const rows = vega.read(csvText, {type: "csv", parse: "auto"});

        const unitValue = 10000;
        const cols = 10;
        const rowGap = 6;

        const selectedRows = rows.filter(d => REGION_DOMAIN.includes(d.Region));

        const waffleData = [];
        const labelData = [];

        selectedRows.forEach((d, regionIndex) => {
            const units = Math.round(d.Population / unitValue);
            const baseRow = regionIndex * rowGap + 2;

            const shortLabel =
                d.Region === "Melbourne - Inner" ? "Inner" :
                d.Region === "Melbourne - West" ? "West" :
                d.Region === "Mornington Peninsula" ? "Mornington" :
                d.Region === "Latrobe - Gippsland" ? "Latrobe" :
                d.Region;

            labelData.push({
                Region: d.Region,
                Label: shortLabel,
                PopulationLabel: `${Math.round(d.Population / 1000)}k`,
                X: -2.8,
                Y: baseRow + 1.4
            });

            for (let i = 0; i < units; i++) {
                waffleData.push({
                    Region: d.Region,
                    Population: d.Population,
                    Col: i % cols,
                    Row: baseRow + Math.floor(i / cols)
                });
            }
        });

        const populationSizeChart = {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

            "width": 390,
            "height": 390,

            "title": {
                "text": "Population scale varies by region",
                "subtitle": "Each square represents about 10,000 residents",
                "anchor": "start",
                "fontSize": 16,
                "subtitleFontSize": 11
            },

            "layer": [
                {
                    "data": {"values": waffleData},

                    "mark": {
                        "type": "square",
                        "size": 105,
                        "opacity": 0.9
                    },

                    "encoding": {
                        "x": {
                            "field": "Col",
                            "type": "quantitative",
                            "axis": null,
                            "scale": {"domain": [-3.5, 10.5]}
                        },

                        "y": {
                            "field": "Row",
                            "type": "quantitative",
                            "axis": null,
                            "scale": {"reverse": true}
                        },

                        "color": {
                            "field": "Region",
                            "type": "nominal",
                            "scale": {
                                "domain": REGION_DOMAIN,
                                "range": REGION_RANGE
                            },
                            "legend": null
                        },

                        "tooltip": [
                            {"field": "Region"},
                            {"field": "Population", "format": ","}
                        ]
                    }
                },

                {
                    "data": {"values": labelData},

                    "mark": {
                        "type": "text",
                        "align": "right",
                        "fontSize": 11,
                        "fontWeight": "700",
                        "fill": "#475569"
                    },

                    "encoding": {
                        "x": {"field": "X", "type": "quantitative"},
                        "y": {"field": "Y", "type": "quantitative"},
                        "text": {"field": "Label"}
                    }
                },

                {
                    "data": {"values": labelData},

                    "mark": {
                        "type": "text",
                        "align": "left",
                        "fontSize": 11,
                        "fontWeight": "700",
                        "fill": "#1e293b"
                    },

                    "encoding": {
                        "x": {"value": 50},
                        "y": {"field": "Y", "type": "quantitative"},
                        "text": {"field": "PopulationLabel"}
                    }
                }
            ],

            "config": BASE_CONFIG
        };

        vegaEmbed("#populationSizeVis", populationSizeChart, {actions: false});
    });

const heatmapChart = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 360,
    "height": 220,

    "padding": {
        "left": 5,
        "right": 5,
        "top": 5,
        "bottom": 5
    },

    "data": {
        "url": "Data/age_heatmap.csv"
    },

    "transform": [
        {
            "filter": {
                "field": "Region",
                "oneOf": CORE_REGIONS
            }
        }
    ],

    "title": {
        "text": "Age profiles differ across migration regions",
        "subtitle": "Share of population by broad age group (%)",
        "anchor": "start",
        "fontSize": 16,
        "subtitleFontSize": 11
    },

    "layer": [

        {
            "mark": {
                "type": "rect",
                "cornerRadius": 2
            },

            "encoding": {

                "x": {
                    "field": "AgeGroup",
                    "type": "nominal",
                    "title": "Age group",
                    "axis": {
                        "labelAngle": 0
                    }
                },

                "y": {
                    "field": "Region",
                    "type": "nominal",
                    "title": null
                },

                "color": {
                    "field": "Share",
                    "type": "quantitative",
                    "title": "Population share (%)",
                    "scale": {
                        "range": ["#dbeafe", "#2166ac"]
                    },
                    "legend": {
                        "title": "Share (%)",
                        "orient": "right",
                        "gradientLength": 170,
                        "gradientThickness": 14,
                        "labelFontSize": 12,
                        "titleFontSize": 13
                    }
                },
                
                "tooltip": [
                    {"field": "Region", "title": "Region"},
                    {"field": "AgeGroup", "title": "Age group"},
                    {"field": "Share", "title": "Population share (%)", "format": ".0f"}
                ]
            }
        },

        {
            "mark": {
                "type": "text",
                "fontSize": 11,
                "fontWeight": "600"
            },

            "encoding": {

                "x": {
                    "field": "AgeGroup",
                    "type": "nominal"
                },

                "y": {
                    "field": "Region",
                    "type": "nominal"
                },

                "text": {
                    "field": "Share",
                    "type": "quantitative",
                    "format": ".0f"
                },

                "color": {
                    "condition": {
                        "test": "datum.Population > 70000",
                        "value": "white"
                    },
                    "value": "#1e293b"
                }
            }
        }
    ],

    "config": BASE_CONFIG
};

vegaEmbed("#heatmapVis", heatmapChart, {actions:false});

const componentsChart = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 760,
    "height": 460,
    "padding": {"left": 10, "right": 10, "top": 10, "bottom": 10},

    "data": {"url": "Data/components_clean.csv"},

    "transform": [
        {
            "filter": {
                "field": "Region",
                "oneOf": CORE_REGIONS
            }
        },
        {
            "calculate": "datum.Value > 0 ? '+' + format(datum.Value, ',') : format(datum.Value, ',')",
            "as": "ValueLabel"
        }
    ],

    "title": {
        "text": "Population growth has multiple drivers",
        "subtitle": "Natural increase, internal migration and overseas migration, 2024–25",
        "anchor": "start",
        "fontSize": 16,
        "subtitleFontSize": 11
    },

    "layer": [
        {
            "mark": {
                "type": "rule",
                "strokeWidth": 4,
                "opacity": 0.35
            },
            "encoding": {
                "y": {
                    "field": "Region",
                    "type": "nominal",
                    "title": null,
                    "sort": CORE_REGIONS
                },
                "yOffset": {
                    "field": "Component",
                    "type": "nominal"
                },
                "x": {
                    "datum": 0,
                    "type": "quantitative"
                },
                "x2": {
                    "field": "Value",
                    "type": "quantitative"
                },
                "color": {
                    "field": "Component",
                    "type": "nominal",
                    "scale": {
                        "domain": [
                            "Natural increase",
                            "Net internal migration",
                            "Net overseas migration"
                        ],
                        "range": [PALE_BLUE, BLUE, ORANGE]
                    },
                    "legend": null
                }
            }
        },

        {
            "mark": {
                "type": "circle",
                "size": 220,
                "stroke": "white",
                "strokeWidth": 2
            },
            "encoding": {
                "y": {
                    "field": "Region",
                    "type": "nominal",
                    "title": null,
                    "sort": CORE_REGIONS
                },
                "yOffset": {
                    "field": "Component",
                    "type": "nominal"
                },
                "x": {
                    "field": "Value",
                    "type": "quantitative",
                    "title": "Population component, 2024–25",
                    "scale": {"domain": [-8000, 16000]},
                    "axis": {
                        "grid": true,
                        "gridColor": "#e5e7eb",
                        "values": [-5000, 0, 5000, 10000, 15000],
                        "labelExpr":
                            "datum.value == 0 ? '0' : " +
                            "abs(datum.value) >= 1000 ? format(datum.value/1000, '.0f') + 'k' : datum.value"
                    }
                },
                "color": {
                    "field": "Component",
                    "type": "nominal",
                    "scale": {
                        "domain": [
                            "Natural increase",
                            "Net internal migration",
                            "Net overseas migration"
                        ],
                        "range": [PALE_BLUE, BLUE, ORANGE]
                    },
                    "legend": {
                        "title": "Component",
                        "orient": "right",
                        "symbolType": "circle",
                        "symbolSize": 220,
                        "labelFontSize": 13,
                        "titleFontSize": 14
                    }
                },
                "tooltip": [
                    {"field": "Region", "title": "Region"},
                    {"field": "Component", "title": "Component"},
                    {"field": "Value", "title": "Population contribution", "format": ","}
                ]
            }
        },

        {
            "mark": {
                "type": "text",
                "fontSize": 11,
                "fontWeight": "700",
                "baseline": "middle",
                "align": {
                    "expr": "datum.Value < 0 ? 'right' : 'left'"
                },
                "dx": {
                    "expr": "datum.Value < 0 ? -10 : 10"
                }
            },
            "encoding": {
                "y": {
                    "field": "Region",
                    "type": "nominal",
                    "sort": CORE_REGIONS
                },
                "yOffset": {
                    "field": "Component",
                    "type": "nominal"
                },
                "x": {
                    "field": "Value",
                    "type": "quantitative"
                },
                "text": {"field": "ValueLabel"},
                "color": {
                    "field": "Component",
                    "type": "nominal",
                    "scale": {
                        "domain": [
                            "Natural increase",
                            "Net internal migration",
                            "Net overseas migration"
                        ],
                        "range": [PALE_BLUE, BLUE, ORANGE]
                    },
                    "legend": null
                }
            }
        }
    ],

    "config": BASE_CONFIG
};

vegaEmbed("#componentsVis", componentsChart, {actions:false});

const lifestyleChart = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 420,
    "height": 430,
    "padding": {"left": 5, "right": 5, "top": 5, "bottom": 5},

    "data": {"url": "Data/lifestyle_clean.csv"},

    "title": {
        "text": "Lifestyle patterns differ across regions",
        "subtitle": "Work and transport behaviours",
        "anchor": "start",
        "fontSize": 16,
        "subtitleFontSize": 11
    },

    "transform": [
        {"fold": ["WFH", "CarCommute", "PublicTransport"], "as": ["Type", "Value"]},
        {
            "calculate": "datum.Type === 'WFH' ? 'Worked from home' : datum.Type === 'CarCommute' ? 'Travelled by car' : 'Public transport'",
            "as": "Profile"
        },
        {"filter": {"field": "Region", "oneOf": TREND_REGIONS}}
    ],

    "layer": [
        {
            "mark": {
                "type": "line",
                "strokeWidth": 3,
                "opacity": 0.85
            },
            "encoding": {
                "x": {
                    "field": "Value",
                    "type": "quantitative",
                    "title": "% of employed people",
                    "scale": {"domain": [0, 70]}
                },
                "y": {
                    "field": "Profile",
                    "type": "nominal",
                    "title": null,
                    "sort": [
                        "Worked from home",
                        "Public transport",
                        "Travelled by car"
                    ]
                },
                "color": {
                    "field": "Region",
                    "type": "nominal",
                    "scale": {"domain": TREND_REGIONS, "range": TREND_RANGE},
                    "legend": {
                        "title": "Region",
                        "orient": "bottom",
                        "columns": 1,
                        "symbolType": "circle",
                        "symbolSize": 200,
                        "labelFontSize": 13,
                        "titleFontSize": 14
                    }
                },
                "detail": {"field": "Region"}
            }
        },
        {
            "mark": {
                "type": "circle",
                "size": 130,
                "stroke": "white",
                "strokeWidth": 2
            },
            "encoding": {
                "x": {"field": "Value", "type": "quantitative"},
                "y": {
                    "field": "Profile",
                    "type": "nominal",
                    "sort": [
                        "Worked from home",
                        "Public transport",
                        "Travelled by car"
                    ]
                },
                "color": {
                    "field": "Region",
                    "type": "nominal",
                    "scale": {"domain": TREND_REGIONS, "range": TREND_RANGE},
                    "legend": null
                },
                "tooltip": [
                    {"field": "Region"},
                    {"field": "Profile"},
                    {"field": "Value", "title": "Percent", "format": ".1f"}
                ]
            }
        }
    ],

    "config": BASE_CONFIG
};

vegaEmbed("#lifestyleVis", lifestyleChart, {actions:false});

const housingChart = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 420,
    "height": 390,
    "padding": {"left": 10, "right": 10, "top": 20, "bottom": 15},

    "data": {"url": "Data/housing_clean.csv"},

    "title": {
        "text": "Affordability and flexibility shape migration",
        "subtitle": "Housing prices, Working from Home (WFH) and migration",
        "anchor": "start",
        "fontSize": 16,
        "subtitleFontSize": 11
    },

    "transform": [
        {
            "lookup": "Region",
            "from": {
                "data": {"url": "Data/lifestyle_clean.csv"},
                "key": "Region",
                "fields": ["WFH"]
            }
        },
        {
            "lookup": "Region",
            "from": {
                "data": {"url": "Data/migration_clean.csv"},
                "key": "Region",
                "fields": ["Migration"]
            }
        },
        {
            "calculate": "abs(datum.Migration)",
            "as": "MigrationSize"
        },
        {
            "calculate":
                "datum.Region === 'Melbourne - Inner' ? 'Melbourne - Inner' : " +
                "datum.Region === 'Melbourne - West' ? 'Melbourne - West' : " +
                "datum.Region === 'Mornington Peninsula' ? 'Mornington Peninsula' : datum.Region",
            "as": "Label"
        },
        {
            "calculate":
                "datum.Region === 'Melbourne - Inner' ? -52 : " +
                "datum.Region === 'Melbourne - West' ? 8 : " +
                "datum.Region === 'Geelong' ? 10 : " +
                "datum.Region === 'Mornington Peninsula' ? 8 : " +
                "datum.Region === 'Ballarat' ? 8 : 8",
            "as": "LabelDx"
        },
        {
            "calculate":
                "datum.Region === 'Melbourne - Inner' ? -8 : " +
                "datum.Region === 'Melbourne - West' ? -16 : " +
                "datum.Region === 'Geelong' ? 12 : " +
                "datum.Region === 'Mornington Peninsula' ? -10 : " +
                "datum.Region === 'Ballarat' ? -8 : -8",
            "as": "LabelDy"
        }
    ],

    "layer": [
        {
            "mark": {
                "type": "circle",
                "opacity": 0.9,
                "stroke": "white",
                "strokeWidth": 2.5
            },

            "encoding": {
                "x": {
                    "field": "MedianPrice",
                    "type": "quantitative",
                    "title": "Median house price",
                    "scale": {"domain": [480000, 1400000]},
                    "axis": {"format": "$,.0f"}
                },

                "y": {
                    "field": "WFH",
                    "type": "quantitative",
                    "title": "Worked from home (%)",
                    "scale": {"domain": [0, 50]}
                },

                "color": {
                    "field": "Region",
                    "type": "nominal",
                    "scale": {
                        "domain": REGION_DOMAIN,
                        "range": REGION_RANGE
                    },
                    "legend": null
                },

                "size": {
                    "field": "MigrationSize",
                    "type": "quantitative",
                    "scale": {
                        "domain": [0, 6000],
                        "range": [500, 2600]
                    },
                    "legend": {
                        "title": "Migration size",
                        "orient": "bottom",
                        "values": [0, 1000, 2000, 3000, 4000, 5000],
                        "labelExpr": "format(datum.value, ',')",
                        "symbolType": "circle",
                        "labelFontSize": 11,
                        "titleFontSize": 12
                    }
                },

                "tooltip": [
                    {"field": "Region", "title": "Region"},
                    {"field": "MedianPrice", "title": "Median house price", "format": "$,.0f"},
                    {"field": "WFH", "title": "Worked from home (%)", "format": ".1f"},
                    {"field": "Migration", "title": "Net internal migration", "format": ","}
                ]
            }
        },

        {
            "mark": {
                "type": "text",
                "fontSize": 11,
                "fontWeight": "700"
            },

            "encoding": {
                "x": {"field": "MedianPrice", "type": "quantitative"},
                "y": {"field": "WFH", "type": "quantitative"},
                "text": {"field": "Label"},
                "dx": {"field": "LabelDx", "type": "quantitative"},
                "dy": {"field": "LabelDy", "type": "quantitative"},
                "color": {
                    "value": "#1e293b"
                }
            }
        }
    ],

    "config": BASE_CONFIG
};

vegaEmbed("#housingVis", housingChart, {actions:false});
