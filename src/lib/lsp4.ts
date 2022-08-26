// eslint-disable-next-line import/named
import ERC725js, { ERC725JSONSchema } from '@erc725/erc725.js';
import LSP4DigitalAssetSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
// import { URLDataWithHash } from '@erc725/erc725.js/build/main/src/types';
import { LSP4Metadata } from '../generated/lsp4_metadata_schema';
// TODO clean up
// import { validateLSP4MetaData } from './validateLSP4Metdata';
import { IPFS_GATEWAY_BASE_URL } from './config';

export const fetchLSP4Metadata = async (
  address: string,
  provider: any,
): Promise<[string, string, LSP4Metadata]> => {
  const options = {
    ipfsGateway: IPFS_GATEWAY_BASE_URL,
  };

  const erc725Asset = new ERC725js(
    LSP4DigitalAssetSchema as ERC725JSONSchema[],
    address,
    provider,
    options,
  );

  try {
    const LSP4DigitalAsset = await erc725Asset.fetchData([
      'LSP4TokenName',
      'LSP4TokenSymbol',
      'LSP4Metadata',
    ]);
    const LSP4TokenName =
      typeof LSP4DigitalAsset[0]?.value === 'string'
        ? LSP4DigitalAsset[0]?.value
        : '';
    const LSP4TokenSymbol =
      typeof LSP4DigitalAsset[1]?.value === 'string'
        ? LSP4DigitalAsset[1]?.value
        : '';
    /* const LSP4Metadata = validateLSP4MetaData(
      LSP4DigitalAsset[2].value as URLDataWithHash,
    );*/
    return [
      LSP4TokenName,
      LSP4TokenSymbol,
      LSP4DigitalAsset[2].value as LSP4Metadata,
    ];
  } catch (error) {
    console.log(error);
    return [
      '',
      '',
      {
        LSP4Metadata: {
          description: '',
          links: [],
          images: [[]],
          icons: [],
          assets: [],
        },
      },
    ];
  }
};

export const validateLSP4MetaData = (LSP4MetadataJSON: any): LSP4Metadata => {
  let images = [[]];
  let links = [];
  let assets = [];
  let icons = [];

  if (LSP4MetadataJSON?.LSP4Metadata?.images?.length) {
    images = LSP4MetadataJSON?.LSP4Metadata?.images?.filter((image: any) => {
      if (!image?.length) {
        return false;
      }

      return validateImage(image);
    });
  }

  if (LSP4MetadataJSON?.LSP4Metadata?.links?.length) {
    links = LSP4MetadataJSON?.LSP4Metadata?.links.filter((link: any) => {
      return link?.title && link?.url;
    });
  }

  if (LSP4MetadataJSON?.LSP4Metadata?.assets?.length) {
    assets = LSP4MetadataJSON?.LSP4Metadata?.assets.filter((asset: any) => {
      return asset?.hash && asset?.url && asset?.hashFunction && asset.fileType;
    });
  }

  if (LSP4MetadataJSON?.LSP4Metadata?.icons?.length) {
    icons = LSP4MetadataJSON?.LSP4Metadata?.icons?.filter((image: any) => {
      return validateIcon(image);
    });
  }

  return {
    LSP4Metadata: {
      description: LSP4MetadataJSON?.LSP4Metadata?.description || '',
      links,
      images,
      assets,
      icons,
    },
  };
};

const validateIcon = (icon: any) => {
  return (
    icon.width && icon.url && icon.hash && icon.hashFunction && icon.height
  );
};

export const validateImage = (image: any[]) => {
  return image.every((size) => {
    return (
      size.url && size.hash && size.width && size.height && size.hashFunction
    );
  });
};

