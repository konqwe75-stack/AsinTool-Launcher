let draggedToolId = "";

const marketplacesByRegion = {
  NA: [{ name: 'US', id: '1' }, { name: 'BR', id: '526970' }, { name: 'CA', id: '7' }, { name: 'MX', id: '771770' }],
  EU: [{ name: 'UK', id: '3' }, { name: 'DE', id: '4' }, { name: 'FR', id: '5' }, { name: 'IT', id: '35691' },
       { name: 'ES', id: '44551' }, { name: 'IN', id: '44571' }, { name: 'NL', id: '328451' }, { name: 'TR', id: '338851' },
       { name: 'PL', id: '712115121' }, { name: 'SE', id: '704403121' }],
  FE: [{ name: 'JP', id: '6' }, { name: 'AU', id: '111172' }, { name: 'RU', id: '111162' }, { name: 'SG', id: '104444012' }]
};

function updateMarketplaceOptions() {
  const region = document.getElementById('region').value;
  const marketplaceSelect = document.getElementById('marketplace');
  marketplaceSelect.innerHTML = '';
  marketplacesByRegion[region].forEach(mp => {
    const option = document.createElement('option');
    option.value = mp.id;
    option.textContent = mp.name;
    marketplaceSelect.appendChild(option);
  });
}

function drag(event) {
  draggedToolId = event.target.dataset.id;
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event, targetListId) {
  event.preventDefault();
  const sourceList = targetListId === 'available' ? document.getElementById('selectedTools') : document.getElementById('availableTools');
  const targetList = document.getElementById(targetListId === 'available' ? 'availableTools' : 'selectedTools');
  const sourceItem = sourceList.querySelector(`[data-id="${draggedToolId}"]`);

  if (!targetList.querySelector(`[data-id="${draggedToolId}"]`) && sourceItem) {
    const clone = sourceItem.cloneNode(true);
    clone.addEventListener('dragstart', drag);
    targetList.appendChild(clone);
    sourceItem.remove();
  }
}

function openToolTabs() {
  const region = document.getElementById('region').value;
  const marketplaceId = document.getElementById('marketplace').value;
  const asins = document.getElementById('asinInput').value.trim().split(/\s+/);
  const selectedTools = Array.from(document.querySelectorAll('#selectedTools li')).map(li => li.dataset.id);

  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - 364);
  const isoStart = past.toISOString().split('.')[0] + 'Z';
  const isoEnd = now.toISOString().split('.')[0] + 'Z';

  const urls = {
    blameo: asin => `https://csi.amazon.com/view?view=blame_o&item_id=${asin}&marketplace_id=${marketplaceId}`,
    timemachine: asin => `https://timemachine.amazon.com/index.html#/search/item-chunkpointer/${encodeURIComponent(isoStart)}/${encodeURIComponent(isoEnd)}/?item_id=${asin}&marketplace_id=${marketplaceId}`,
    mediacentral: asin => `https://console.harmony.a2z.com/media-central/product-images?asin=${asin}`,
    imagedebugger: asin => `https://variations.amazon.com/ImageDebugger/#asin=${asin}&merchant=undefined&locale=undefined&region=${region.toLowerCase()}`,
    bqe: asin => `https://browse-query-editor-${region.toLowerCase()}.aka.amazon.com/?browseNodeFilter=category-node-merchant-facing&catalogAttributes=item_name%2Cproduct_type%2Cbrand%2Cgl_product_group_type%2Cspecific&marketplaceId=${marketplaceId}&pageSize=25&protocolVersion=imsv2&retailAsins=N&showImages=Y&useSuggestedBrowseNode=N&userQuery=${asin}&variationParentOnly=N&websiteSearchable=N`,
    vermontorphan: asin => `https://vermont.amazon.com/orphan-tool/${marketplaceId}/${asin}`,
    vermonteinstein: asin => `https://vermont.amazon.com/einstein/${marketplaceId}/${asin}`,
    asintool: asin => `https://csi.amazon.com/view?view=asin_creator&item_id=${asin}&marketplace_id=${marketplaceId}&region=${region}&realm=USAmazon&stage=prod&submit=Show`,
    marketplacedata: asin => `https://csi.amazon.com/view?view=domains_for_asin&item_id=${asin}&marketplace_id=${marketplaceId}&region=${region}&realm=USAmazon&stage=prod&submit=Show`
  };

  asins.forEach(asin => {
    selectedTools.forEach(tool => {
      const link = urls[tool]?.(asin);
      if (link) {
        const win = window.open(link, '_blank');
        if (win) win.focus();
      }
    });
  });
}

window.onload = updateMarketplaceOptions;
