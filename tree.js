function tree() {
    buildTree();
    var treeStatus = "hidden";

    $('#headerButtons').find('#settingsButton').before('<div id="treeButton" class="tree"></div>');
    $('#treeButton').on("click", function () { showTree(); });

    function buildTree() {
        $('#container').prepend(`
        <div id="treePage" style="display: none">
            <canvas id="treeCanvas"></canvas>
            <div id="treePanel"></div>
            <div id="treeLegend">
                <div class="legendTitle">Edges</div>
                <div class="legendItem" data-type="alchemy"><span class="legendLine" style="background: rgba(155,89,182,0.7)"></span> Alchemy</div>
                <div class="legendItem" data-type="purify"><span class="legendLine dashed" style="background: rgba(184,134,11,0.7)"></span> Purification</div>
                <div class="legendItem" data-type="produces"><span class="legendLine" style="background: rgba(39,174,96,0.7)"></span> Produces</div>
                <div class="legendItem" data-type="costs"><span class="legendLine dashed" style="background: rgba(192,57,43,0.7)"></span> Costs</div>
                <div class="legendItem" data-type="dust"><span class="legendLine" style="background: rgba(139,105,20,0.6)"></span> Dust</div>
                <div class="legendItem" data-type="distill"><span class="legendLine" style="background: rgba(0,140,210,0.6)"></span> Distill</div>
            </div>
        </div>`);
    }

    window.closeTree = function(){
        if (treeStatus === "shown") {
            treeStatus = "hidden";
            $('#treeButton').addClass("tree").removeClass("back");
            $('#treePage').hide();
            $('#stickmanCanvas').show();
        }
    };

    function showTree() {
        if (treeStatus == "hidden") {
            if (typeof closeSettings === 'function') closeSettings();
            if (typeof closeHumans === 'function') closeHumans();
            if (typeof closeLibrary === 'function') closeLibrary();
            treeStatus = "shown";
            $('#treeButton').removeClass("tree").addClass("back");
            $('#wrapper').hide();
            $('#machines').hide();
            $('#finalMachines').hide();
            $('#treePage').show();
            $('#stickmanCanvas').hide();
            requestAnimationFrame(function () { initGraph(); });
        } else {
            treeStatus = "hidden";
            $('#treeButton').addClass("tree").removeClass("back");
            $('#wrapper').show();
            if (showStatus && showStatus.machines === "unlocked") $('#machines').show();
            if ($('#container').hasClass('has-final-machines')) $('#finalMachines').show();
            $('#treePage').hide();
            $('#stickmanCanvas').show();
        }
    }

    // === Constants ===
    var nodeW = 94, nodeH = 26, cornerR = 1.5;
    var graphW = 3200;
    var layerYs = [40, 170, 300, 430, 560, 690, 820, 940, 1060, 1180, 1300, 1420];
    //             L0   L1    L2    L3   L4    L5   L6    L7   L8    L9    L10   L11

    // === State ===
    var nodeList = [], nodeMap = {}, edgeList = [];
    var canvas, ctx, W, H, dpr;
    var camera = { x: 0, y: 0, zoom: 1 };
    var drag = { active: false, sx: 0, sy: 0, cx: 0, cy: 0 };
    var hoveredNode = null, renderPending = false;
    var showAll = false;

    // Check if a node has been "seen" in the current game
    function isNodeVisible(n) {
        if (showAll) return true;
        var key = getColorKey(n.id);
        var prefix = n.id.indexOf("_") > -1 ? n.id.slice(0, n.id.indexOf("_")) : "";

        // Facts: visible if this fact type has been logged
        if (prefix === "fact") {
            return typeof seenFacts !== "undefined" && seenFacts[key] === true;
        }
        // Impure ideas: itemUnlock.ideas
        if (prefix === "idea") {
            return typeof itemUnlock !== "undefined" && itemUnlock.ideas && itemUnlock.ideas[key] === "unlocked";
        }
        // Impure things: itemUnlock.things
        if (prefix === "thing") {
            return typeof itemUnlock !== "undefined" && itemUnlock.things && itemUnlock.things[key] === "unlocked";
        }
        // Dusts: itemUnlock.dusts
        if (n.id.length > 4 && n.id.slice(-4) === "Dust") {
            return typeof itemUnlock !== "undefined" && itemUnlock.dusts && itemUnlock.dusts[key] === "unlocked";
        }
        // Liquids: itemUnlock.liquids
        if (prefix === "liquid") {
            return typeof itemUnlock !== "undefined" && itemUnlock.liquids && itemUnlock.liquids[key] === "unlocked";
        }
        // Pure ideas
        if (typeof ideas !== "undefined" && ideas[key] > 0) return true;
        // Pure things
        if (typeof things !== "undefined" && things[key] > 0) return true;
        // Seen via books or athenaeum
        if (typeof seenNames !== "undefined" && seenNames[key]) return true;
        return false;
    }

    function isEdgeVisible(e) {
        var fromNode = nodeMap[e.from], toNode = nodeMap[e.to];
        if (!fromNode || !toNode) return false;
        return isNodeVisible(fromNode) && isNodeVisible(toNode);
    }

    // === Text styles — matching in-game color.css ===
    var textStyles = {
        want: { color: "firebrick" }, mentalize: { color: "navy" },
        reify: { color: "forestgreen" }, pulverize: { color: "DimGray" },
        purify: { color: "Goldenrod" }, alchemize: { color: "rgb(2,35,14)" },
        destroy: { color: "rgb(84,79,72)" }, separate: { color: "OliveDrab" },
        mentAll: { color: "CadetBlue" },
        mind: { color: "DodgerBlue" }, strength: { color: "BlueViolet" },
        matter: { color: "LimeGreen" }, will: { color: "MediumVioletRed" },
        recursion: { color: "magenta" }, idealSubstance: { color: "CadetBlue" },
        respect: { color: "Blue" }, thought: { color: "DarkTurquoise" },
        primaMateria: { color: "OliveDrab" }, entropy: { color: "rgb(81,20,105)" },
        luck: { color: "rgb(0,205,103)" }, abstraction: { color: "CadetBlue" },
        technology: { color: "Brown" }, progress: { color: "MediumSeaGreen" },
        machineU: { color: "Brown" }, unlock: { color: "MediumSeaGreen" },
        respect: { color: "Blue" }, luck: { color: "rgb(0,205,103)" },
        fire: { color: "OrangeRed" }, water: { color: "DeepSkyBlue" },
        earth: { color: "Sienna" }, decay: { color: "rgb(81,20,105)" },
        shadow: { color: "#444", shadowColor: "rgba(10,10,10,1)", shadowBlur: 2 },
        purity: { color: "gold", shadowColor: "gold", shadowBlur: 4 },
        air: { color: "LightSkyBlue", shadowColor: "LightSkyBlue", shadowBlur: 4 },
        light: { color: "gold", shadowColor: "gold", shadowBlur: 3 },
        fortitude: { gradient: ["DodgerBlue", "BlueViolet"] },
        madness: { gradient: ["DodgerBlue", "magenta"] },
        loyalty: { gradient: ["BlueViolet", "Blue"] },
        problemSolving: { gradient: ["DarkTurquoise", "magenta"] },
        divinity: { gradient: ["DarkTurquoise", "OliveDrab"] },
        idea: { gradient: ["CadetBlue", "DarkTurquoise"] },
        faith: { gradient: ["Blue", "OliveDrab"] },
        spark: { gradient: ["DarkTurquoise", "OliveDrab"] },
        philosophy: { gradient: ["DarkTurquoise", "CadetBlue"] },
        "void": { gradient: ["white", "black"] },
        creation: { gradient: ["OliveDrab", "CadetBlue"] },
        evil: { gradient: ["rgb(0,0,0)", "rgb(226,14,84)"] },
        death: { gradient: ["darkgrey", "black"] },
        destruction: { gradient: ["BlueViolet", "MediumVioletRed"] },
        awe: { gradient: ["Blue", "DodgerBlue"] },
        fear: { gradient: ["#444", "DodgerBlue"] },
        dream: { gradient: ["rgba(173,216,255,0.9)", "rgba(200,170,255,0.8)", "rgba(255,180,220,0.7)"] },
        magma: { gradient: ["OrangeRed", "Sienna"] },
        liquor: { gradient: ["navy", "OliveDrab"] },
        mana: { gradient: ["Goldenrod", "rgb(2,35,14)"] },
        preserver: { gradient: ["forestgreen", "rgb(84,79,72)"] },
        // Things (tier 1 materials)
        steam: { color: "#B0C4DE" },
        mud: { color: "#8B6914" },
        storm: { color: "#4A6FA5" },
        blood: { color: "#8B0000" },
        marrow: { color: "#D2B48C" },
        breath: { color: "#A8D8EA" },
        flesh: { color: "#E8BEAC" },
        // Tier 2 ideas
        consciousness: { color: "#7B68EE" },
        reason: { color: "#5F9EA0" },
        imagination: { color: "#DA70D6" },
        corruption: { color: "#556B2F" },
        passion: { color: "#DC143C" },
        innocence: { color: "#FFD700" },
        devotion: { color: "#4169E1" },
        grief: { color: "#696969" },
        sacrifice: { color: "#800020" },
        // Souls & Minds
        rationalMind: { color: "#4682B4" },
        creativeMind: { color: "#FF6347" },
        madMind: { color: "#9932CC" },
        braveSoul: { color: "#B22222" },
        lovingSoul: { color: "#FF69B4" },
        darkSoul: { color: "#2F2F2F" },
        // Life
        life: { gradient: ["CadetBlue", "OliveDrab", "MediumVioletRed"] },
        // Tier 1 alchemized things
        crystal: { gradient: ["gold", "Sienna"] },
        obsidian: { gradient: ["#444", "OrangeRed"] },
        clay: { gradient: ["MediumVioletRed", "Sienna"] },
        incense: { gradient: ["DarkTurquoise", "OrangeRed"] },
        relic: { gradient: ["rgb(81,20,105)", "Sienna"] },
        stone: { gradient: ["BlueViolet", "Sienna"] },
        wax: { gradient: ["gold", "OrangeRed"] },
        lightning: { gradient: ["OrangeRed", "LightSkyBlue"] },
        dust: { gradient: ["Sienna", "LightSkyBlue"] },
        // Tier 2 alchemized things
        lens: { gradient: ["DarkTurquoise", "rgb(200,170,255)"] },
        vessel: { gradient: ["rgb(81,20,105)", "gold"] },
        monolith: { gradient: ["BlueViolet", "gold"] },
        // New alchemized things/ideas
        ash: { gradient: ["OrangeRed", "#444"] },
        resonance: { gradient: ["LightSkyBlue", "DarkTurquoise"] },
        soil: { gradient: ["Sienna", "rgb(81,20,105)"] },
        dew: { gradient: ["DeepSkyBlue", "gold"] },
        splinter: { gradient: ["Sienna", "#444"] },
        glyph: { gradient: ["DarkTurquoise", "MediumVioletRed"] },
        halo: { gradient: ["OrangeRed", "gold"] },
        mist: { gradient: ["DeepSkyBlue", "LightSkyBlue"] },
        seed: { gradient: ["Sienna", "MediumVioletRed"] },
        // Artifacts
        ember: { gradient: ["OrangeRed", "DarkTurquoise", "#444"] },
        echo: { gradient: ["LightSkyBlue", "rgb(200,170,255)", "magenta"] },
        root: { gradient: ["Sienna", "BlueViolet", "OliveDrab"] },
        tear: { gradient: ["DeepSkyBlue", "#696969", "#FFD700"] },
        shard: { gradient: ["Sienna", "#4B0082", "gold"] },
        sigil: { gradient: ["DarkTurquoise", "rgb(226,14,84)", "OrangeRed"] },
        crown: { gradient: ["OrangeRed", "DarkTurquoise", "Blue"] },
        veil: { gradient: ["DeepSkyBlue", "DodgerBlue", "#4A6FA5"] },
        wreath: { gradient: ["Sienna", "OliveDrab", "CadetBlue"] },
    };

    function getColorKey(id) {
        if (id.indexOf("fact_") === 0) return id.slice(5);
        if (id.indexOf("idea_") === 0) return id.slice(5);
        if (id.indexOf("thing_") === 0) return id.slice(6);
        if (id.indexOf("liquid_") === 0) return id.slice(7);
        if (id.length > 4 && id.slice(-4) === "Dust") return id.slice(0, -4);
        return id;
    }

    var edgeStyles = {
        alchemy:  { color: "rgba(155,89,182,", base: 0.35, hi: 0.9,  w: 2,   dash: null },
        purify:   { color: "rgba(184,134,11,", base: 0.3,  hi: 0.85, w: 1.8, dash: [5, 3] },
        produces: { color: "rgba(39,174,96,",  base: 0.35, hi: 0.9,  w: 2,   dash: null },
        costs:    { color: "rgba(192,57,43,",  base: 0.25, hi: 0.8,  w: 1.8, dash: [5, 3] },
        dust:     { color: "rgba(139,105,20,", base: 0.3,  hi: 0.8,  w: 1.8, dash: null },
        distill:  { color: "rgba(0,140,210,",  base: 0.3,  hi: 0.85, w: 1.8, dash: null },
    };

    // === Helpers ===
    function addNode(id, label, category) {
        var n = { id: id, label: label, category: category, layer: -1,
                  x: 0, y: 0, w: nodeW, h: nodeH };
        nodeList.push(n);
        nodeMap[id] = n;
    }

    function addEdge(fromId, toId, type, label) {
        if (!nodeMap[fromId] || !nodeMap[toId] || fromId === toId) return;
        for (var i = 0; i < edgeList.length; i++) {
            var e = edgeList[i];
            if ((e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId)) return;
        }
        edgeList.push({ from: fromId, to: toId, type: type || "produces", label: label || "", path: [] });
    }

    function layoutRow(ids, layerIdx, gap) {
        gap = gap || 14;
        var total = 0;
        ids.forEach(function (id) { if (nodeMap[id]) total += nodeMap[id].w; });
        total += (ids.length - 1) * gap;
        var x = (graphW - total) / 2;
        ids.forEach(function (id) {
            if (!nodeMap[id]) return;
            nodeMap[id].x = x;
            nodeMap[id].y = layerYs[layerIdx];
            nodeMap[id].layer = layerIdx;
            x += nodeMap[id].w + gap;
        });
    }

    function layoutGroup(ids, centerX, layerIdx, gap) {
        gap = gap || 16;
        var total = 0;
        ids.forEach(function (id) { if (nodeMap[id]) total += nodeMap[id].w; });
        total += (ids.length - 1) * gap;
        var startX = centerX - total / 2;
        var x = startX;
        ids.forEach(function (id) {
            if (!nodeMap[id]) return;
            nodeMap[id].x = x;
            nodeMap[id].y = layerYs[layerIdx];
            nodeMap[id].layer = layerIdx;
            x += nodeMap[id].w + gap;
        });
    }

    // === Build graph ===
    function buildGraphData() {
        nodeList = []; edgeList = []; nodeMap = {};

        // -- L0: Facts (log messages) --
        var factIds = Object.keys(actions);
        factIds.forEach(function (id) {
            addNode("fact_" + id, actions[id].log, "fact");
        });

        // -- L1: Impure ideas --
        var impureIds = ["want", "mentalize", "reify", "pulverize", "purify", "alchemize", "separate", "destroy"];
        impureIds.forEach(function (id) {
            addNode("idea_" + id, items[id].idea, "impureIdea");
        });
        addNode("idea_mentAll", items["mentAll"].idea, "impureIdea");

        // -- L1: Impure things --
        impureIds.forEach(function (id) {
            addNode("thing_" + id, items[id].thing, "impureThing");
        });

        // -- L2: Dusts --
        impureIds.forEach(function (id) {
            addNode(id + "Dust", items[id].dust, "dust");
        });

        // -- L4: Liquids --
        var liquidIds = [];
        Object.keys(items).forEach(function (id) {
            if (items[id].distilled && items[id].liquid) {
                addNode("liquid_" + id, items[id].liquid, "liquid");
                liquidIds.push(id);
            }
        });

        // -- L5-L7: All pure ideas (base + alchemized, all the same) --
        var baseIdeas = ["mind", "strength", "will", "recursion", "idealSubstance", "respect",
                         "thought", "primaMateria", "shadow", "entropy", "purity"];
        baseIdeas.forEach(function (id) {
            addNode(id, items[id].idea, "pureIdea");
        });

        // Alchemized ideas
        var alchIdeas = [];
        Object.keys(items).forEach(function (id) {
            if (items[id].subtype === "alchemified" && items[id].idea) {
                addNode(id, items[id].idea, "pureIdea");
                alchIdeas.push(id);
            }
        });

        // Other pure ideas
        ["luck", "abstraction", "technology", "progress"].forEach(function (id) {
            addNode(id, items[id].idea, "pureIdea");
        });

        // Prestige pure ideas
        ["clarity", "courage", "spirit", "failure"].forEach(function (id) {
            if (items[id] && items[id].idea) addNode(id, items[id].idea, "pureIdea");
        });

        // -- Pure things (matter + elements + alchemized things) --
        var alchThings = [];
        addNode("matter", items["matter"].thing, "pureThing");
        ["fire", "earth", "water", "air"].forEach(function (id) {
            addNode(id, items[id].thing, "pureThing");
        });
        Object.keys(items).forEach(function (id) {
            if (items[id].subtype === "alchemified" && items[id].thing && !items[id].idea) {
                addNode(id, items[id].thing, "pureThing");
                alchThings.push(id);
            }
        });

        // Prestige pure things
        ["leather", "elixir", "canvas", "paint", "masterpiece", "gold", "beads", "goo", "sin"].forEach(function (id) {
            if (items[id] && items[id].thing) addNode(id, items[id].thing, "pureThing");
        });

        // Prestige liquid
        if (items.blessedOil && items.blessedOil.liquid) {
            addNode("liquid_blessedOil", items.blessedOil.liquid, "liquid");
        }

        // Artifacts
        var artifactIds = [];
        Object.keys(items).forEach(function (id) {
            if (items[id].type === "artifact") {
                addNode(id, items[id].thing, "artifact");
                artifactIds.push(id);
            }
        });

        // failAlchemize impure chain
        if (items.failAlchemize) {
            addNode("idea_failAlchemize", items.failAlchemize.idea, "impureIdea");
            addNode("thing_failAlchemize", items.failAlchemize.thing, "impureThing");
            addNode("failAlchemizeDust", items.failAlchemize.dust, "dust");
        }

        // === Measure ALL node widths ===
        ctx.save();
        ctx.font = "700 11px 'EB Garamond'";
        nodeList.forEach(function (n) {
            n.w = ctx.measureText(n.label).width + 8;
        });
        ctx.restore();

        // Impure columns: compute column center x from the widest node, but keep each tile tight
        var colCenters = {};
        var colMaxW = {};
        impureIds.forEach(function (id) {
            colMaxW[id] = Math.max(nodeMap["idea_" + id].w, nodeMap["thing_" + id].w, nodeMap[id + "Dust"].w);
        });

        var gap = 14;
        var totalImpureW = nodeMap["idea_mentAll"].w;
        impureIds.forEach(function (id) { totalImpureW += colMaxW[id]; });
        totalImpureW += impureIds.length * gap;
        graphW = Math.max(graphW, totalImpureW + 200);

        // Position each column: nodes centered within the column slot
        var x = (graphW - totalImpureW) / 2;
        impureIds.forEach(function (id) {
            var slotW = colMaxW[id];
            var cx = x + slotW / 2;
            var ni = nodeMap["idea_" + id];
            var nt = nodeMap["thing_" + id];
            var nd = nodeMap[id + "Dust"];
            ni.x = cx - ni.w / 2; ni.y = layerYs[1]; ni.layer = 1;
            nt.x = cx - nt.w / 2; nt.y = layerYs[2]; nt.layer = 2;
            nd.x = cx - nd.w / 2; nd.y = layerYs[3]; nd.layer = 3;
            colCenters[id] = cx;
            x += slotW + gap;
        });
        var nm = nodeMap["idea_mentAll"];
        nm.x = x + nm.w / 2 - nm.w / 2;
        nm.y = layerYs[1];
        nm.layer = 1;

        // L4: Liquids — positioned by averaging the x of their dust ingredients
        function sortLiquidsByIngredientX(ids) {
            return ids.map(function (id) {
                var avgX = 0, cnt = 0;
                if (items[id].ingredients) {
                    items[id].ingredients.forEach(function (ing) {
                        var dustNode = nodeMap[ing + "Dust"];
                        if (dustNode) { avgX += dustNode.x + dustNode.w / 2; cnt++; }
                    });
                }
                if (cnt > 0) avgX /= cnt;
                return { id: "liquid_" + id, avgX: avgX };
            }).sort(function (a, b) { return a.avgX - b.avgX; }).map(function (a) { return a.id; });
        }
        var sortedLiquidNodeIds = sortLiquidsByIngredientX(liquidIds);
        layoutRow(sortedLiquidNodeIds, 4, 40);

        // L5: Base pure ideas
        layoutRow(baseIdeas, 5, 40);

        // Separate alchemized ideas into tiers by ingredient depth
        var baseIdeaSet = {};
        baseIdeas.forEach(function (id) { baseIdeaSet[id] = true; });

        // Tier 1: ingredients are all base ideas (not alchemized)
        // Tier 2: at least one ingredient is alchemized (tier 1)
        // Tier 3: minds, souls, life — 3-ingredient recipes or ingredients are tier 2
        var tier1 = [], tier2 = [], tier3 = [];
        var placed = {};

        // Multi-pass: assign tiers based on whether ingredients are already placed
        var remaining = alchIdeas.slice();
        var pass = 0;
        while (remaining.length > 0 && pass < 10) {
            var next = [];
            var placedThisPass = [];
            remaining.forEach(function (id) {
                var ings = items[id].ingredients || [];
                var allPlaced = ings.every(function (ing) {
                    return baseIdeaSet[ing] || placed[ing] || !nodeMap[ing] || (nodeMap[ing] && nodeMap[ing].category !== "pureIdea");
                });
                if (allPlaced) {
                    if (pass === 0) tier1.push(id);
                    else if (pass === 1) tier2.push(id);
                    else tier3.push(id);
                    placedThisPass.push(id);
                } else {
                    next.push(id);
                }
            });
            placedThisPass.forEach(function (id) { placed[id] = true; });
            remaining = next;
            pass++;
        }
        tier3 = tier3.concat(remaining);

        function sortByIngredientX(ids) {
            return ids.map(function (id) {
                var avgX = 0, cnt = 0;
                if (items[id].ingredients) {
                    items[id].ingredients.forEach(function (ing) {
                        if (nodeMap[ing] && nodeMap[ing].layer >= 0) {
                            avgX += nodeMap[ing].x + nodeMap[ing].w / 2; cnt++;
                        }
                    });
                }
                if (cnt > 0) avgX /= cnt;
                return { id: id, avgX: avgX };
            }).sort(function (a, b) { return a.avgX - b.avgX; }).map(function (a) { return a.id; });
        }

        // L6: Tier 1 alchemized
        var t1sorted = sortByIngredientX(tier1);
        layoutRow(t1sorted, 6, 40);

        // L7: Tier 2 alchemized + luck/abstraction/technology/progress
        var t2sorted = sortByIngredientX(tier2);
        t2sorted.push("luck", "abstraction", "technology", "progress");
        layoutRow(t2sorted, 7, 40);

        // L8: Matter
        layoutRow(["matter"], 8, 40);

        // L9: Elements + alchemized things
        var elemIds = ["fire", "earth", "water", "air"].concat(alchThings);
        layoutRow(elemIds, 9, 40);

        // L10: Tier 3 — minds, souls, life (below everything else)
        var t3sorted = sortByIngredientX(tier3);
        layoutRow(t3sorted, 10, 40);

        // L11: Prestige resources + artifacts
        var prestigeRow = ["clarity", "courage", "spirit", "failure",
                           "leather", "elixir", "canvas", "paint", "masterpiece",
                           "gold", "beads", "goo", "sin"].filter(function(id){ return nodeMap[id]; });
        if (nodeMap["liquid_blessedOil"]) prestigeRow.push("liquid_blessedOil");
        prestigeRow = prestigeRow.concat(artifactIds.filter(function(id){ return nodeMap[id]; }));
        if (prestigeRow.length) layoutRow(prestigeRow, 11, 40);

        // failAlchemize impure chain layout (alongside other impure columns)
        if (nodeMap["idea_failAlchemize"]) {
            var faX = graphW - 100;
            nodeMap["idea_failAlchemize"].x = faX; nodeMap["idea_failAlchemize"].y = layerYs[1]; nodeMap["idea_failAlchemize"].layer = 1;
            nodeMap["thing_failAlchemize"].x = faX; nodeMap["thing_failAlchemize"].y = layerYs[2]; nodeMap["thing_failAlchemize"].layer = 2;
            nodeMap["failAlchemizeDust"].x = faX; nodeMap["failAlchemizeDust"].y = layerYs[3]; nodeMap["failAlchemizeDust"].layer = 3;
        }

        // L0: Facts — layout as a row, no incoming edges
        layoutRow(factIds.map(function (id) { return "fact_" + id; }), 0);

        // === Edges ===

        // Fact → impure idea (mentalize, costs 1 Mind), or directly to pure idea for special facts
        factIds.forEach(function (id) {
            if (nodeMap["idea_" + id]) {
                addEdge("fact_" + id, "idea_" + id, "produces", "mentalize (costs 1 Mind)");
            } else if (items[id] && items[id].purified && nodeMap[items[id].purified]) {
                addEdge("fact_" + id, items[id].purified, "produces", "purify");
            } else if (nodeMap[id]) {
                addEdge("fact_" + id, id, "produces", "");
            }
        });

        // Column: idea → thing (reify, costs 1 Matter), thing → dust (pulverize, costs 1 Strength)
        impureIds.forEach(function (id) {
            addEdge("idea_" + id, "thing_" + id, "produces", "reify (costs 1 Matter)");
            addEdge("thing_" + id, id + "Dust", "dust", "pulverize (costs 1 Strength)");
        });

        // Purification: impure idea → purified pure (costs 1 Recursion)
        impureIds.concat(["mentAll"]).forEach(function (id) {
            if (items[id].purified && nodeMap[items[id].purified]) {
                addEdge("idea_" + id, items[id].purified, "purify", "purify (costs 1 Recursion)");
            }
        });

        // Self-recursion
        addEdge("idea_mentalize", "recursion", "produces", "+1 recursion");
        addEdge("idea_reify", "recursion", "produces", "+10 recursion");
        addEdge("idea_pulverize", "recursion", "produces", "+100 recursion");
        addEdge("idea_purify", "recursion", "produces", "+10000 recursion");

        // MentAll → idealSubstance
        addEdge("idea_mentAll", "idealSubstance", "produces", "+N");

        // failAlchemize chain edges
        if (nodeMap["idea_failAlchemize"]) {
            addEdge("fact_failAlchemize", "idea_failAlchemize", "produces", "mentalize");
            addEdge("idea_failAlchemize", "thing_failAlchemize", "produces", "reify");
            addEdge("thing_failAlchemize", "failAlchemizeDust", "dust", "pulverize");
            addEdge("idea_failAlchemize", "failure", "purify", "purify");
        }

        // Alchemy: ingredients → result
        Object.keys(items).forEach(function (id) {
            if (items[id].ingredients) {
                items[id].ingredients.forEach(function (ing) {
                    if (nodeMap[ing] && nodeMap[id]) addEdge(ing, id, "alchemy");
                });
            }
        });

        // Separation: matter → elements
        addEdge("matter", "fire", "produces", "separate");
        addEdge("matter", "water", "produces", "separate");
        addEdge("matter", "earth", "produces", "separate");
        addEdge("matter", "air", "produces", "separate");

        // Converters: dust → base resource
        addEdge("mentalizeDust", "mind", "produces", "conv 1\u219210");
        addEdge("reifyDust", "matter", "produces", "conv 1\u219210");
        addEdge("wantDust", "will", "produces", "conv 1\u219210");
        addEdge("wantDust", "strength", "produces", "conv 1\u219210");

        // Distillery: dusts → liquid (costs water)
        liquidIds.forEach(function (id) {
            if (items[id].ingredients) {
                items[id].ingredients.forEach(function (ing) {
                    addEdge(ing + "Dust", "liquid_" + id, "distill", "distill (costs Water)");
                });
            }
        });

        computeEdgePaths();
    }

    // === Orthogonal edge routing ===
    function computeEdgePaths() {
        var gaps = [];
        for (var i = 0; i < layerYs.length - 1; i++) {
            gaps.push({ top: layerYs[i] + nodeH + 3, bottom: layerYs[i + 1] - 3, edges: [] });
        }

        edgeList.forEach(function (edge, idx) {
            var a = nodeMap[edge.from], b = nodeMap[edge.to];
            if (!a || !b || a.layer < 0 || b.layer < 0) return;
            var downward = a.layer < b.layer;
            var sameLayer = a.layer === b.layer;

            var gapIdx;
            if (sameLayer) {
                gapIdx = a.layer < gaps.length ? a.layer : a.layer - 1;
            } else if (downward) {
                gapIdx = b.layer - 1;
            } else {
                gapIdx = b.layer;
            }
            if (gapIdx < 0) gapIdx = 0;
            if (gapIdx >= gaps.length) gapIdx = gaps.length - 1;

            edge._gapIdx = gapIdx;
            edge._downward = downward;
            edge._sameLayer = sameLayer;
            gaps[gapIdx].edges.push(idx);
        });

        gaps.forEach(function (gap) {
            if (!gap.edges.length) return;
            gap.edges.sort(function (ai, bi) {
                var ea = edgeList[ai], eb = edgeList[bi];
                return (nodeMap[ea.from].x + nodeMap[ea.to].x) / 2 - (nodeMap[eb.from].x + nodeMap[eb.to].x) / 2;
            });
            var pad = 5, avail = gap.bottom - gap.top - pad * 2, n = gap.edges.length;
            var spacing = n > 1 ? avail / (n - 1) : 0;
            gap.edges.forEach(function (edgeIdx, i) {
                edgeList[edgeIdx]._channelY = n > 1 ? gap.top + pad + i * spacing : (gap.top + gap.bottom) / 2;
            });
        });

        edgeList.forEach(function (edge) {
            if (edge.path.length) return;
            var a = nodeMap[edge.from], b = nodeMap[edge.to];
            var acx = a.x + a.w / 2, bcx = b.x + b.w / 2, cy = edge._channelY;
            if (edge._sameLayer) {
                var r = bcx > acx;
                var ex = r ? a.x + a.w : a.x, en = r ? b.x : b.x + b.w, sy = a.y + a.h / 2;
                edge.path = [{ x: ex, y: sy }, { x: ex + (r ? 6 : -6), y: sy },
                    { x: ex + (r ? 6 : -6), y: cy }, { x: en + (r ? -6 : 6), y: cy },
                    { x: en + (r ? -6 : 6), y: sy }, { x: en, y: sy }];
            } else if (edge._downward) {
                edge.path = [{ x: acx, y: a.y + a.h }, { x: acx, y: cy }, { x: bcx, y: cy }, { x: bcx, y: b.y }];
            } else {
                edge.path = [{ x: acx, y: a.y }, { x: acx, y: cy }, { x: bcx, y: cy }, { x: bcx, y: b.y + b.h }];
            }
        });

        offsetEndpoints("from", true);
        offsetEndpoints("to", false);
        separateOverlaps();
    }

    // Detect and nudge overlapping vertical/horizontal segments from different edges
    function separateOverlaps() {
        var nudge = 5;

        // Collect all vertical segments
        var vSegs = [];
        edgeList.forEach(function (e, ei) {
            if (!e.path) return;
            for (var i = 0; i < e.path.length - 1; i++) {
                var p0 = e.path[i], p1 = e.path[i + 1];
                if (Math.abs(p0.x - p1.x) < 0.5 && Math.abs(p0.y - p1.y) > 1) {
                    vSegs.push({
                        x: Math.round(p0.x * 2) / 2,
                        yMin: Math.min(p0.y, p1.y),
                        yMax: Math.max(p0.y, p1.y),
                        ei: ei, pi: i
                    });
                }
            }
        });
        vSegs.sort(function (a, b) { return a.x - b.x || a.yMin - b.yMin; });

        for (var i = 0; i < vSegs.length; i++) {
            for (var j = i + 1; j < vSegs.length && Math.abs(vSegs[j].x - vSegs[i].x) < 1.5; j++) {
                if (vSegs[i].ei === vSegs[j].ei) continue;
                // Check y overlap
                if (vSegs[i].yMin < vSegs[j].yMax - 1 && vSegs[j].yMin < vSegs[i].yMax - 1) {
                    // Nudge the entire vertical run of edge j's segment
                    var e = edgeList[vSegs[j].ei];
                    var pi = vSegs[j].pi;
                    e.path[pi].x += nudge;
                    e.path[pi + 1].x += nudge;
                    vSegs[j].x += nudge;
                }
            }
        }

        // Collect all horizontal segments
        var hSegs = [];
        edgeList.forEach(function (e, ei) {
            if (!e.path) return;
            for (var i = 0; i < e.path.length - 1; i++) {
                var p0 = e.path[i], p1 = e.path[i + 1];
                if (Math.abs(p0.y - p1.y) < 0.5 && Math.abs(p0.x - p1.x) > 1) {
                    hSegs.push({
                        y: Math.round(p0.y * 2) / 2,
                        xMin: Math.min(p0.x, p1.x),
                        xMax: Math.max(p0.x, p1.x),
                        ei: ei, pi: i
                    });
                }
            }
        });
        hSegs.sort(function (a, b) { return a.y - b.y || a.xMin - b.xMin; });

        for (var i = 0; i < hSegs.length; i++) {
            for (var j = i + 1; j < hSegs.length && Math.abs(hSegs[j].y - hSegs[i].y) < 1.5; j++) {
                if (hSegs[i].ei === hSegs[j].ei) continue;
                if (hSegs[i].xMin < hSegs[j].xMax - 1 && hSegs[j].xMin < hSegs[i].xMax - 1) {
                    var e = edgeList[hSegs[j].ei];
                    var pi = hSegs[j].pi;
                    e.path[pi].y += nudge;
                    e.path[pi + 1].y += nudge;
                    hSegs[j].y += nudge;
                }
            }
        }
    }

    function offsetEndpoints(nodeKey, isExit) {
        var groups = {};
        edgeList.forEach(function (edge, idx) {
            if (!edge.path || edge.path.length < 2) return;
            var node = nodeMap[edge[nodeKey]];
            if (!node) return;
            var pt = isExit ? edge.path[0] : edge.path[edge.path.length - 1];
            var isVert = Math.abs(pt.x - (node.x + node.w / 2)) < node.w / 2 + 1 &&
                (Math.abs(pt.y - node.y) < 2 || Math.abs(pt.y - (node.y + node.h)) < 2);
            if (!isVert) return;
            var side = Math.abs(pt.y - node.y) < 2 ? "t" : "b";
            var key = edge[nodeKey] + "||" + side;
            if (!groups[key]) groups[key] = [];
            groups[key].push(idx);
        });
        Object.keys(groups).forEach(function (key) {
            var group = groups[key];
            if (group.length <= 1) return;
            var nodeId = key.slice(0, key.lastIndexOf("||"));
            var node = nodeMap[nodeId];
            if (!node) return;
            var centerX = node.x + node.w / 2;
            var maxSpread = Math.min((node.w / 2) - 4, group.length * 4);
            group.sort(function (ai, bi) {
                var ea = edgeList[ai], eb = edgeList[bi];
                var aO = isExit ? ea.path[ea.path.length - 1].x : ea.path[0].x;
                var bO = isExit ? eb.path[eb.path.length - 1].x : eb.path[0].x;
                return aO - bO;
            });
            group.forEach(function (edgeIdx, i) {
                var off = group.length > 1 ? -maxSpread + i * (2 * maxSpread / (group.length - 1)) : 0;
                var nx = centerX + off;
                var p = edgeList[edgeIdx].path;
                if (isExit) {
                    p[0].x = nx;
                    if (p.length > 2) p[1].x = nx;
                } else {
                    p[p.length - 1].x = nx;
                    if (p.length > 2) p[p.length - 2].x = nx;
                }
            });
        });
    }

    // === Rendering ===
    function rrect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    function drawRect(x, y, w, h, alpha) {
        ctx.globalAlpha = alpha;
        rrect(x, y, w, h, cornerR);
        ctx.fillStyle = "#F1F1F0";
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    function drawEdgePath(path, style, highlighted) {
        if (!path || path.length < 2) return;
        var alpha = highlighted ? style.hi : style.base;
        var color = style.color + alpha + ")";
        var lw = highlighted ? style.w * 1.8 : style.w;
        ctx.beginPath();
        if (style.dash) ctx.setLineDash(style.dash); else ctx.setLineDash([]);
        ctx.moveTo(path[0].x, path[0].y);
        for (var i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
        ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.stroke(); ctx.setLineDash([]);
        var last = path[path.length - 1], prev = path[path.length - 2];
        var angle = Math.atan2(last.y - prev.y, last.x - prev.x), hl = 10;
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(last.x - hl * Math.cos(angle - 0.45), last.y - hl * Math.sin(angle - 0.45));
        ctx.lineTo(last.x - hl * Math.cos(angle + 0.45), last.y - hl * Math.sin(angle + 0.45));
        ctx.closePath(); ctx.fillStyle = color; ctx.fill();
    }

    function render() {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        ctx.save();
        ctx.translate(camera.x, camera.y);
        ctx.scale(camera.zoom, camera.zoom);

        var focusNode = hoveredNode;
        var connectedIds = {};
        var costHighlights = []; // {nodeId, label} for cost resources to highlight
        if (focusNode) {
            connectedIds[focusNode.id] = true;
            edgeList.forEach(function (e) {
                if (!isEdgeVisible(e)) return;
                if (e.from === focusNode.id) connectedIds[e.to] = true;
                if (e.to === focusNode.id) connectedIds[e.from] = true;
            });
            // Determine transformation cost for the focused node
            var fp = focusNode.id.indexOf("_") > -1 ? focusNode.id.slice(0, focusNode.id.indexOf("_")) : "";
            if (fp === "idea" && nodeMap["mind"]) {
                connectedIds["mind"] = true;
                costHighlights.push({ id: "mind", label: "-1 (mentalize)" });
            }
            if (fp === "thing" && nodeMap["matter"]) {
                connectedIds["matter"] = true;
                costHighlights.push({ id: "matter", label: "-1 (reify)" });
            }
            if (focusNode.id.length > 4 && focusNode.id.slice(-4) === "Dust" && nodeMap["strength"]) {
                connectedIds["strength"] = true;
                costHighlights.push({ id: "strength", label: "-1 (pulverize)" });
            }
            if (fp === "liquid" && nodeMap["water"]) {
                connectedIds["water"] = true;
                costHighlights.push({ id: "water", label: "-" + (typeof distilleryGaugeSize !== "undefined" ? distilleryGaugeSize : "N") + " (distill)" });
            }
            edgeList.forEach(function (e) {
                if (e.to === focusNode.id && e.type === "purify" && nodeMap["recursion"]) {
                    connectedIds["recursion"] = true;
                    costHighlights.push({ id: "recursion", label: "-1 (purify)" });
                }
            });
        }


        // Track which edge types are visible for legend
        var visibleEdgeTypes = {};

        // Edges
        edgeList.forEach(function (e) {
            if (!isEdgeVisible(e)) return;
            visibleEdgeTypes[e.type] = true;
            var style = edgeStyles[e.type] || edgeStyles.produces;
            var hi = focusNode && (e.from === focusNode.id || e.to === focusNode.id);
            if (focusNode && !hi) {
                drawEdgePath(e.path, { color: style.color, base: style.base * 0.12, hi: style.hi, w: style.w, dash: style.dash }, false);
            } else {
                drawEdgePath(e.path, style, hi);
            }
        });

        // Update legend visibility
        $('#treeLegend .legendItem').each(function () {
            var type = $(this).data('type');
            if (type) $(this).toggle(!!visibleEdgeTypes[type]);
        });
        $('#treeLegend').toggle(Object.keys(visibleEdgeTypes).length > 0);

        // Nodes
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        nodeList.forEach(function (n) {
            if (n.layer < 0) return;
            var visible = isNodeVisible(n);

            // Ghost placeholder for locked nodes
            if (!visible) {
                ctx.globalAlpha = 1;
                rrect(n.x, n.y, n.w, n.h, cornerR);
                ctx.fillStyle = "#fff";
                ctx.fill();
                ctx.setLineDash([4, 3]);
                ctx.strokeStyle = "#ccc";
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.setLineDash([]);
                return;
            }

            var isFocused = focusNode && focusNode.id === n.id;
            var isConnected = focusNode && connectedIds[n.id];
            var alpha = focusNode ? (isConnected ? 1 : 0.15) : 1;

            if (isFocused) {
                ctx.shadowColor = "rgba(0,0,0,0.2)";
                ctx.shadowBlur = 8; ctx.shadowOffsetY = 2;
            }
            drawRect(n.x, n.y, n.w, n.h, alpha);
            ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

            ctx.font = "700 11px 'EB Garamond'";
            ctx.globalAlpha = alpha;
            var textX = n.x + n.w / 2;
            var textY = n.y + n.h / 2 + 1;
            var maxTextW = n.w - 6;
            var label = n.label;
            while (ctx.measureText(label).width > maxTextW && label.length > 3) {
                label = label.slice(0, -1);
            }
            if (label !== n.label) label += "\u2026";

            var key = getColorKey(n.id);
            var ts = textStyles[key];

            if (ts && ts.shadowColor) {
                ctx.shadowColor = ts.shadowColor;
                ctx.shadowBlur = ts.shadowBlur || 0;
            }

            if (ts && ts.gradient) {
                var tw = ctx.measureText(label).width;
                var grad = ctx.createLinearGradient(textX - tw / 2, textY - 6, textX - tw / 2, textY + 6);
                for (var g = 0; g < ts.gradient.length; g++) {
                    grad.addColorStop(g / Math.max(ts.gradient.length - 1, 1), ts.gradient[g]);
                }
                ctx.fillStyle = grad;
            } else if (ts && ts.color) {
                ctx.fillStyle = ts.color;
            } else {
                ctx.fillStyle = "#333";
            }

            ctx.fillText(label, textX, textY);
            ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        });

        // Draw floating cost labels above cost resource nodes
        if (costHighlights.length) {
            ctx.font = "700 10px 'EB Garamond'";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            costHighlights.forEach(function (ch) {
                var cn = nodeMap[ch.id];
                if (!cn || cn.layer < 0) return;
                var cx = cn.x + cn.w / 2;
                var cy = cn.y - 6;
                // Background pill
                var tw = ctx.measureText(ch.label).width + 8;
                var th = 14;
                rrect(cx - tw / 2, cy - th, tw, th, 2);
                ctx.fillStyle = "rgba(192,57,43,0.85)";
                ctx.fill();
                // Text
                ctx.fillStyle = "#fff";
                ctx.fillText(ch.label, cx, cy - 2);
            });
        }

        ctx.restore();
    }

    function requestRender() {
        if (!renderPending) {
            renderPending = true;
            requestAnimationFrame(function () { try { render(); } finally { renderPending = false; } });
        }
    }

    // === Interaction ===
    function screenToWorld(sx, sy) {
        return { x: (sx - camera.x) / camera.zoom, y: (sy - camera.y) / camera.zoom };
    }

    function findNodeAt(wx, wy) {
        for (var i = nodeList.length - 1; i >= 0; i--) {
            var n = nodeList[i];
            if (n.layer < 0 || !isNodeVisible(n)) continue;
            if (wx >= n.x && wx <= n.x + n.w && wy >= n.y && wy <= n.y + n.h) return n;
        }
        return null;
    }

    function initGraph() {
        canvas = document.getElementById("treeCanvas");
        ctx = canvas.getContext("2d");
        dpr = window.devicePixelRatio || 1;

        var parent = canvas.parentElement;
        W = parent.clientWidth;
        H = parent.clientHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + "px";
        canvas.style.height = H + "px";

        $(window).off("resize.tree").on("resize.tree", function () {
            W = parent.clientWidth; H = parent.clientHeight;
            canvas.width = W * dpr; canvas.height = H * dpr;
            canvas.style.width = W + "px"; canvas.style.height = H + "px";
            requestRender();
        });

        buildGraphData();

        // Fit graph
        var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        nodeList.forEach(function (n) {
            if (n.layer < 0) return;
            minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x + n.w);
            minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y + n.h);
        });
        var gw = maxX - minX, gh = maxY - minY, pad = 40;
        camera.zoom = Math.min((W - pad * 2) / gw, (H - pad * 2) / gh, 1);
        camera.x = (W - gw * camera.zoom) / 2 - minX * camera.zoom;
        camera.y = (H - gh * camera.zoom) / 2 - minY * camera.zoom;

        requestRender();

        $(canvas).off(".tree");
        $(document).off(".tree");

        $(canvas).on("mousedown.tree", function (e) {
            drag.active = true;
            drag.sx = e.clientX; drag.sy = e.clientY;
            drag.cx = camera.x; drag.cy = camera.y;
            e.preventDefault();
        });

        $(document).on("mousemove.tree", function (e) {
            var rect = canvas.getBoundingClientRect();
            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
            if (drag.active) {
                camera.x = drag.cx + (e.clientX - drag.sx);
                camera.y = drag.cy + (e.clientY - drag.sy);
                requestRender();
            }
            var w = screenToWorld(mx, my);
            var found = findNodeAt(w.x, w.y);
            if (found !== hoveredNode) {
                hoveredNode = found;
                canvas.style.cursor = found ? "default" : "grab";
                requestRender();
            }
            var panel = $('#treePanel');
            if (found) {
                var outgoing = [], incoming = [];
                edgeList.forEach(function (edge) {
                    if (!isEdgeVisible(edge)) return;
                    var toN = nodeMap[edge.to], fromN = nodeMap[edge.from];
                    if (edge.from === found.id && toN) {
                        outgoing.push("\u2192 " + toN.label + (edge.label ? " <span class='panelLabel'>(" + edge.label + ")</span>" : "") + " <span class='panelType'>" + edge.type + "</span>");
                    }
                    if (edge.to === found.id && fromN) {
                        incoming.push("\u2190 " + fromN.label + (edge.label ? " <span class='panelLabel'>(" + edge.label + ")</span>" : "") + " <span class='panelType'>" + edge.type + "</span>");
                    }
                });
                var html = "<div class='panelHeader'>" + found.label + "</div>";
                html += "<div class='panelCat'>" + found.category + "</div>";
                if (incoming.length) html += "<div class='panelSection'>Inputs</div>" + incoming.join("<br>");
                if (outgoing.length) html += "<div class='panelSection'>Outputs</div>" + outgoing.join("<br>");
                panel.html(html).show();
            } else {
                panel.hide();
            }
        });

        $(document).on("mouseup.tree", function () { drag.active = false; });

        canvas.addEventListener("wheel", function (e) {
            e.preventDefault();
            var rect = canvas.getBoundingClientRect();
            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
            var oldZoom = camera.zoom;
            camera.zoom = Math.max(0.15, Math.min(3, camera.zoom * (e.deltaY < 0 ? 1.12 : 0.89)));
            camera.x = mx - (mx - camera.x) * (camera.zoom / oldZoom);
            camera.y = my - (my - camera.y) * (camera.zoom / oldZoom);
            requestRender();
        }, { passive: false });

        $(document).on("keydown.tree", function (e) {
            // T: toggle show all nodes (debug)
            if (e.key === "t" || e.key === "T") {
                showAll = !showAll;
                requestRender();
            }
        });
    }

    // Expose API for modifiers
    window._tree = {
        setShowAll: function(val) { showAll = val; if (typeof requestRender === 'function') requestRender(); }
    };
}
